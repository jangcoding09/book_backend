const { Like, Book } = require("../models");

const getBookLike = async (req, res) => {
  try {
    const { bookId, id } = req.params;

    const like = await Like.findOne({
      where: { bookId },
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
    let likeCount = 0;
    if (!bookId || !id) {
      throw new Error("Invalid bookId or userId");
    }

    let like = await Like.findOne({
      where: { bookId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (like) {
      const userIds = like.userIds || [];
      console.log(userIds, "userIds");
      if (!userIds.includes(id)) {
        like.userIds = [...userIds, id];
        console.log(like, "updated");
        likeCount = like.userIds.length;
        await like.save({ transaction });
      } else {
        console.log("User has already liked this book");
      }
    } else {
      like = await Like.create(
        {
          bookId,
          userIds: [id],
        },
        { transaction }
      );

      await Book.increment("likeCount", {
        where: { id: bookId },
        transaction,
      });
    }

    await transaction.commit();
    console.log(likeCount, "likeCount");
    res.status(200).json({ likeCount: likeCount, isLike: true });
  } catch (error) {
    console.error("Error in addLike:", error);
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error("Error during rollback:", rollbackError);
    }
    res.status(500).json({ error: error.message });
  }
};

const removeLike = async (req, res) => {
  const transaction = await Like.sequelize.transaction();

  try {
    const { bookId, id } = req.params;

    if (!bookId || !id) {
      throw new Error("Invalid bookId or userId");
    }

    let like = await Like.findOne({
      where: { bookId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (like) {
      const userIds = like.userIds || [];
      const updatedUserIds = userIds.filter((userId) => userId !== id);

      if (userIds.length !== updatedUserIds.length) {
        like.userIds = updatedUserIds;
        await like.save({ transaction });

        await Book.decrement("likeCount", {
          where: { id: bookId },
          transaction,
        });
      } else {
        console.log("User has not liked this book");
      }
    }

    await transaction.commit();

    res
      .status(200)
      .json({ likeCount: like ? like.userIds.length : 0, isLike: false });
  } catch (error) {
    console.error("Error in removeLike:", error);
    try {
      await transaction.rollback();
    } catch (rollbackError) {
      console.error("Error during rollback:", rollbackError);
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getBookLike,
  addLike,
  removeLike,
};
