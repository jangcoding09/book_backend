const { Story } = require("../models");
const { fetchImagesForStory } = require("./fetchImagesForStory");

const getBestStories = async (req, res) => {
  try {
    const bestStories = await Story.findAll({
      where: { isSecret: false },
      limit: 10,
      order: [["likeCount", "DESC"]],
    });

    if (bestStories.length === 0) {
      return res.status(404).json({ error: "No best stories found" });
    }

    const storiesWithImages = await Promise.allSettled(
      bestStories.map(async (story) => {
        try {
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
            likeCount: story.likeCount,
            images,
          };
        } catch (error) {
          console.error(`Error fetching images for story ${story.id}:`, error);
          return null;
        }
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

    const randomStories = await Promise.allSettled(
      [...randomIndexes].map(async (index) => {
        try {
          const story = await Story.findOne({
            where: { isSecret: false },
            offset: index,
          });
          if (!story) {
            console.warn(`Story at index ${index} not found`);
            return null;
          }
          return story;
        } catch (error) {
          console.error(`Error fetching story at index ${index}:`, error);
          return null;
        }
      })
    );
    const validStories = randomStories
      .filter(
        (result) => result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value);

    if (validStories.length === 0) {
      return res.status(404).json({ error: "No valid stories found" });
    }
    const storiesWithImages = await Promise.allSettled(
      validStories.map(async (story) => {
        try {
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
            likeCount: story.likeCount,
            images,
          };
        } catch (error) {
          console.error(`Error fetching images for story ${story.id}:`, error);
          return null;
        }
      })
    );

    const finalStories = storiesWithImages
      .filter(
        (result) => result.status === "fulfilled" && result.value !== null
      )
      .map((result) => result.value);

    res.status(200).json({
      data: { stories: finalStories },
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
