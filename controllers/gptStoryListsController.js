const { Story } = require("../models");
const { fetchImagesForStory } = require("./fetchImagesForStory");

const getBestStories = async (req, res) => {
  try {
    const bestStories = await Story.findAll({
      where: { isSecret: false },
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
    const totalCount = await Story.count();

    const randomIndexes = [];
    const limit = 10;
    while (randomIndexes.length < limit) {
      const randomIndex = Math.floor(Math.random() * totalCount);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }

    const randomStories = await Promise.all(
      randomIndexes.map(async (index) => {
        try {
          const story = await Story.findOne({
            where: { isSecret: false },
            offset: index,
          });
          if (!story) throw new Error(`Story not found at index ${index}`);
          return story;
        } catch (error) {
          console.error(`Error fetching story at index ${index}:`, error);
          return null;
        }
      })
    );

    const validStories = randomStories.filter((story) => story !== null);

    const storiesWithImages = await Promise.all(
      validStories.map(async (story) => {
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
    console.error("Error fetching random stories:", error);
    res.status(500).json({ error: "Failed to get random stories" });
  }
};

module.exports = {
  getBestStories,
  getRandomStories,
};
