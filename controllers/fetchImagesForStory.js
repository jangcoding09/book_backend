// fetchImagesForBook.js
const { Op } = require("sequelize");
const { Image } = require("../models");

const fetchImagesForStory = async (story) => {
  if (!story.imageIds || story.imageIds.length === 0) return [];

  const images = await Image.findAll({
    where: {
      id: {
        [Op.in]: story.imageIds,
      },
    },
  });

  return images;
};

module.exports = { fetchImagesForStory };
