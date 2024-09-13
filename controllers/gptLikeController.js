const { GptLike, Story } = require("../models");

const getStoryLike = async (req, res) => {
  try {
    const { storyId, id } = req.params;

    const like = await GptLike.findOne({
      where: { storyId },
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
  const transaction = await GptLike.sequelize.transaction();

  try {
    const { storyId, id } = req.params;
    let likeCount = 0;
    if (!storyId || !id) {
      throw new Error("Invalid storyId or userId");
    }

    let like = await GptLike.findOne({
      where: { storyId },
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

        // Increment likeCount in Story model
        await Story.increment("likeCount", {
          where: { id: storyId },
          transaction,
        });
      } else {
        console.log("User has already liked this book");
      }
    } else {
      like = await GptLike.create(
        {
          storyId,
          userIds: [id],
        },
        { transaction }
      );

      // Increment likeCount in Story model
      await Story.increment("likeCount", {
        where: { id: storyId },
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
  const transaction = await GptLike.sequelize.transaction();

  try {
    const { storyId, id } = req.params;

    if (!storyId || !id) {
      throw new Error("Invalid bookId or userId");
    }

    let like = await GptLike.findOne({
      where: { storyId },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (like) {
      const userIds = like.userIds || [];
      const updatedUserIds = userIds.filter((userId) => userId !== id);

      if (userIds.length !== updatedUserIds.length) {
        like.userIds = updatedUserIds;
        await like.save({ transaction });

        // Decrement likeCount in Story model
        await Story.decrement("likeCount", {
          where: { id: storyId },
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
  getStoryLike,
  addLike,
  removeLike,
};
