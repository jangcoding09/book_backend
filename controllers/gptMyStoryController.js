const { Story } = require("../models");
const { v4: isUUID } = require("uuid");
const { fetchImagesForStory } = require("./fetchImagesForStory");
const getMyStories = async (req, res) => {
  const { take = 10, page = 1, order__createdAt = "DESC" } = req.query;
  const userId = req.params.userId;
  console.log(userId, "userId............");
  if (!userId) {
    return res.status(403).send({
      message: "로그인이 필요합니다.",
    });
  }
  // Validate if userId is a valid UUID
  if (!isUUID(userId)) {
    console.log(userId, "is not a valid UUID.");
    return res.status(400).send({
      message: "잘못된 사용자 ID 형식입니다.",
    });
  }

  try {
    const stories = await Story.findAll({
      where: {
        userId: userId,
      },
      order: [["createdAt", order__createdAt]],
      limit: parseInt(take),
      offset: (page - 1) * take,
    });

    // Check if stories exist
    if (!stories || stories.length === 0) {
      return res.status(200).send({
        data: {
          stories: [],
        },
        total: 0,
      });
    }

    const storiesWithImages = await Promise.all(
      stories.map(async (story) => {
        const images = await fetchImagesForStory(story);
        return {
          id: story.id,
          title: story.title,
          category: story.category,
          isSecret: story.isSecret,
          createdAt: story.createdAt,
          updatedAt: story.updatedAt,
          authorName: story.authorName,
          userId: story.userId,
          images,
        };
      })
    );
    const total = await Story.count({
      where: {
        userId: userId,
      },
    });

    res.status(200).send({
      data: {
        stories: storiesWithImages,
      },
      total: total,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "에러가 발생했습니다.",
    });
  }
};
const getMyStory = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  //userId와 id를 통해 받아온 스토리의 userId가 같은지 확인하고 같지 않으면 에러
  try {
    const story = await Story.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!story) {
      return res.status(404).send({
        message: "스토리를 찾을 수 없습니다.",
      });
    }

    res.status(200).send({
      title: story.title,
      content: story.content,
      category: story.category,
      isSecret: story.isSecret,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
      images: await fetchImagesForStory(story),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "에러가 발생했습니다.",
    });
  }
};
const patchDisclosure = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const story = await Story.findOne({
      where: {
        id: id,
        userId: userId,
      },
    });

    if (!story) {
      return res.status(404).send({
        message: "스토리를 찾을 수 없습니다.",
      });
    }

    await story.update({
      isSecret: !story.isSecret, // isSecret 값을 반전시킴
    });

    res.status(200).send({
      message: "스토리가 업데이트 되었습니다.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "에러가 발생했습니다.",
    });
  }
};
module.exports = {
  getMyStories,
  getMyStory,
  patchDisclosure,
};
