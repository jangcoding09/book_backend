const { Like, Book } = require("../models");

const getBookLike = async (req, res) => {
  try {
    const { bookId, id } = req.params;

    const like = await Like.findOne({
      where: {
        bookId: bookId,
      },
    });

    if (!like) {
      return res.status(200).json({
        isLike: false,
        likeId: null,
        likeCount: 0,
      });
    }

    const userIds = like.userIds || [];
    const isLike = userIds.includes(id);

    res.status(200).json({
      isLike,
      likeId: like.id,
      likeCount: userIds.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addLike = async (req, res) => {
  const transaction = await Like.sequelize.transaction();

  try {
    const { bookId, id } = req.params;
    if (!bookId || !id) {
      console.error("Invalid bookId or userId", { bookId, id });
      throw new Error("Invalid bookId or userId");
    }

    let like = await Like.findOne({
      where: {
        bookId: bookId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (like) {
      const userIds = like.userIds || [];
      if (!userIds.includes(id)) {
        userIds.push(id);
        like.userIds = userIds;
        await like.save({ transaction });
      }
    } else {
      like = await Like.create(
        {
          bookId: bookId,
          userIds: [id],
        },
        { transaction }
      );
    }

    const book = await Book.findByPk(bookId, { transaction });
    book.likeCount += 1;
    await book.save({ transaction });

    await transaction.commit();

    res.status(200).json({ likeCount: book.likeCount, isLike: true });
  } catch (error) {
    console.error("Transaction error", { error });
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

const removeLike = async (req, res) => {
  const transaction = await Like.sequelize.transaction();

  try {
    const { bookId, id } = req.params;
    if (!bookId || !id) {
      console.error("Invalid bookId or userId", { bookId, id });
      throw new Error("Invalid bookId or userId");
    }

    let like = await Like.findOne({
      where: {
        bookId: bookId,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (like) {
      const userIds = like.userIds || [];
      console.log("Before removal:", userIds); // Debugging line
      like.userIds = userIds.filter((userId) => userId !== id);
      console.log("After removal:", like.userIds); // Debugging line
      await like.save({ transaction });

      const book = await Book.findByPk(bookId, { transaction });
      book.likeCount -= 1;
      await book.save({ transaction });

      await transaction.commit();

      // 트랜잭션 커밋 후 데이터 확인
      const updatedLike = await Like.findOne({ where: { bookId: bookId } });
      console.log("After commit:", updatedLike.userIds); // Debugging line
    }

    res
      .status(200)
      .json({ likeCount: like ? like.userIds.length : 0, isLike: false });
  } catch (error) {
    console.error("Transaction error", { error });
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  getBookLike,
  addLike,
  removeLike,
};
