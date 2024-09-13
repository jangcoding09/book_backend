const { Story } = require("../models");
const { fetchImagesForStory } = require("./fetchImagesForStory");

const getBestStories = async (req, res) => {
  try {
    const bestStories = await Story.findAll({
      limit: 10,
      order: [["likeCount", "DESC"]],
    });
    const storiesWithImages = await Promise.all(
      bestStories.map(async (story) => {
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
          clicks: story.clicks,
          images,
        };
      })
    );
    res.status(200).json({
      data: {
        stories: storiesWithImages,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get best stories" });
  }
};

const getRandomStories = async (req, res) => {
  try {
    // 1. 전체 스토리 수 확인
    const totalCount = await Story.count();

    // 2. 무작위로 선택할 인덱스 생성
    const randomIndexes = [];
    const limit = 10; // 가져올 데이터 개수
    while (randomIndexes.length < limit) {
      const randomIndex = Math.floor(Math.random() * totalCount);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }

    // 3. 선택된 인덱스의 데이터 가져오기
    const randomStories = await Promise.all(
      randomIndexes.map(async (index) => {
        const story = await Story.findOne({ offset: index });
        return story;
      })
    );

    // 4. 각 스토리에 이미지 데이터 추가
    const storiesWithImages = await Promise.all(
      randomStories.map(async (story) => {
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

    res.status(200).json({
      data: {
        stories: storiesWithImages,
      },
    });
  } catch (error) {
    console.error("Error fetching random stories:", error);
    res.status(500).json({ error: "Failed to get random stories" });
  }
};
module.exports = {
  getBestStories,
  getRandomStories,
};
