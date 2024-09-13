const { Op } = require("sequelize");
const { User, Book, Image } = require("../models");
const { bucket } = require("../firbase");
const { fetchImagesForBook } = require("./fetchImagesForBook");
// 특정 책 정보를 가져오는 함수
const getbook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findByPk(bookId, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "nickname", "role", "email", "profileImg"],
        },
      ],
    });

    if (!book) {
      return res.status(404).send({ error: "Book not found" });
    }

    const images = await fetchImagesForBook(book);

    const bookWithImages = {
      ...book.toJSON(),
      images,
    };

    res.send(bookWithImages);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getbooks = async (req, res) => {
  try {
    const {
      take = 10,
      page = 1,
      order__createdAt,
      where__title__i_like,
      where__author__i_like,
      order__clicks,
    } = req.query;

    const where = {};
    if (where__title__i_like) {
      where.title = { [Op.iLike]: `%${where__title__i_like}%` };
    }

    if (where__author__i_like) {
      where.authorName = { [Op.iLike]: `%${where__author__i_like}%` };
    }

    const order = [];
    if (order__createdAt) {
      order.push(["createdAt", order__createdAt]);
    }
    if (order__clicks) {
      order.push(["clicks", order__clicks]);
    }

    const booksResult = await Book.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "nickname", "role", "email", "profileImg"],
        },
      ],
      order,
      limit: parseInt(take, 10),
      offset: (page - 1) * take,
    });

    const booksWithImages = await Promise.all(
      booksResult.rows.map(async (book) => {
        const images = await fetchImagesForBook(book);
        return {
          ...book.toJSON(),
          images,
        };
      })
    );

    res.json({
      data: booksWithImages,
      cursor: {
        after: page,
      },
      count: booksResult.count,
      next:
        booksResult.rows.length === parseInt(take, 10)
          ? `/book?take=${take}&page=${parseInt(page, 10) + 1}`
          : null,
      total: booksResult.count,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send({ error: error.message });
  }
};

// 새로운 책을 추가하는 함수
const postbook = async (req, res) => {
  const transaction = await Book.sequelize.transaction();

  try {
    const { title, content, authorName, category, imageIds } = req.body;
    const userId = req.user.id; // JWT 토큰에서 추출한 사용자 ID 사용
    const book = await Book.create(
      { title, content, userId, authorName, category, imageIds },
      { transaction }
    );

    await transaction.commit();
    res.status(201).send(book);
  } catch (error) {
    await transaction.rollback();
    res.status(500).send({ error: error.message });
  }
};
// 특정 책 정보를 수정하는 함수
//book notfound 에러 발생
const patchbook = async (req, res) => {
  try {
    const { id } = req.params;
    const { images, title, content, category, authorName } = req.body;

    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).send({ error: "Book not found" });
    }

    // 책의 필드 업데이트
    book.imageIds = images || book.imageIds;
    book.title = title || book.title;
    book.content = content || book.content;
    book.category = category || book.category;
    book.authorName = authorName || book.authorName;
    await book.save();

    const updatedImages = await Image.findAll({
      where: {
        id: {
          [Op.in]: book.imageIds,
        },
      },
    });
    const updatedImagePaths = updatedImages.map((image) => image.path);
    const updatedImageIds = updatedImages.map((image) => image.id);

    res.status(200).send({
      book: {
        id: book.id,
        title: book.title,
        content: book.content,
        category: book.category,
        authorName: book.authorName,
        imageIds: book.imageIds,
      },
      imageIds: updatedImageIds,
      imagePaths: updatedImagePaths,
    });
  } catch (error) {
    console.error("Error updating book images:", error);
    res.status(500).send({ error: error.message });
  }
};

// 특정 책을 삭제하는 함수
const deletebook = async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).send({ error: "Book not found" });
    }

    // 관련 이미지를 찾습니다
    const images = await Image.findAll({
      where: {
        id: {
          [Op.in]: book.imageIds,
        },
      },
    });

    // 이미지들을 Firebase Storage에서 삭제합니다
    for (const image of images) {
      try {
        const file = bucket.file(image.fbPath); // `fbPath`는 Firebase Storage에서 파일의 경로를 나타냅니다
        await file.delete();
      } catch (deleteError) {
        console.error(
          `Error deleting file ${image.fbPath}:`,
          deleteError.message
        );
      }
    }

    // 데이터베이스에서 이미지를 삭제합니다
    await Image.destroy({
      where: {
        id: {
          [Op.in]: book.imageIds,
        },
      },
    });

    await book.destroy();
    res.send({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
const incrementClicks = async (req, res) => {
  const bookId = req.params.id;
  const cookieName = `book_${bookId}_clicked`;

  try {
    const book = await Book.findByPk(bookId);

    if (!book) {
      return res.status(404).send({ error: "Book not found" });
    }

    const clicked = req.cookies[cookieName];

    if (!clicked) {
      book.clicks += 1;
      await book.save();
      res.cookie(cookieName, "true", {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        sameSite: "Lax", // 이 설정을 추가하여 CORS 환경에서 쿠키 전송을 허용
      });
    }

    res.status(200).send({ clicks: book.clicks, cookieName });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getbook,
  getbooks,
  postbook,
  deletebook,
  patchbook,
  incrementClicks,
};
