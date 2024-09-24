const { Like, Book, Image, Story, GptLike } = require("../models");
const { Op } = require("sequelize");
const { fetchImagesForBook } = require("./fetchImagesForBook");
const { fetchImagesForStory } = require("./fetchImagesForStory");
//getMyFavorites
const getMyFavoriteBooks = async (req, res) => {
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

const getMyFavoriteStories = async (req, res) => {
  try {
    const { take = 10, page = 1, order__createdAt = "DESC" } = req.query;
    const id = req.user.id;

    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const offset = (page - 1) * take;

    const likes = await GptLike.findAll({
      where: {
        userIds: {
          [Op.contains]: [id],
        },
      },
      attribute: ["storyId"],
      order: [["createdAt", order__createdAt]],
      limit: parseInt(take),
      offset: parseInt(offset),
    });
    console.log(likes, "likes--");
    const totalLikes = await GptLike.count({
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
    const storyIds = likes.map((like) => like.storyId);
    console.log(storyIds, "storyIds");
    const stories = await Story.findAll({
      where: {
        id: {
          [Op.in]: storyIds,
        },
      },
    });

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
          likeCount: story.likeCount,
          authorName: story.authorName,
          category: story.category,
          clicks: story.clicks,
          images,
        };
      })
    );

    res.status(200).json({
      books: storiesWithImages,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMyFavoriteBooks,
  getMyFavoriteStories,
};
