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
    if (!bookId && !id) {
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

    // 책의 likeCount를 증가시킴
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
    if (!bookId && !id) {
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
      const userIndex = userIds.indexOf(id);
      if (userIndex !== -1) {
        userIds.splice(userIndex, 1);
        like.userIds = userIds;
        await like.save({ transaction });
      }

      // 책의 likeCount를 감소시킴
      const book = await Book.findByPk(bookId, { transaction });
      book.likeCount -= 1;
      await book.save({ transaction });
    }

    await transaction.commit();

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
