const { Like, Book, Image } = require("../models");
const { Op } = require("sequelize");
const { fetchImagesForBook } = require("./fetchImagesForBook");
//getMyFavorites
const getMyFavorites = async (req, res) => {
  try {
    const { take = 10, page = 1, order__createdAt = "DESC" } = req.query;
    const id = req.user.id;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const offset = (page - 1) * take;

    const likes = await Like.findAll({
      where: {
        userIds: {
          [Op.contains]: [id],
        },
      },
      order: [["createdAt", order__createdAt]],
      limit: parseInt(take),
      offset: parseInt(offset),
    });

    const totalLikes = await Like.count({
      where: {
        userIds: {
          [Op.contains]: [id],
        },
      },
    });

    const totalPages = Math.ceil(totalLikes / take);

    if (!likes.length) {
      return res.status(200).json({
        books: [],
        totalPages,
        currentPage: page,
      });
    }
    const bookIds = likes.map((like) => like.bookId);
    const books = await Book.findAll({
      where: {
        id: {
          [Op.in]: bookIds,
        },
      },
    });

    const booksWithImages = await Promise.all(
      books.map(async (book) => {
        const images = await fetchImagesForBook(book);
        return {
          ...book.toJSON(),
          images,
        };
      })
    );

    res.status(200).json({
      books: booksWithImages,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMyFavorites,
};
