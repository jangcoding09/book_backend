// fetchImagesForBook.js
const { Op } = require("sequelize");
const { Image } = require("../models");

const fetchImagesForBook = async (book) => {
  if (!book.imageIds || book.imageIds.length === 0) return [];

  const images = await Image.findAll({
    where: {
      id: {
        [Op.in]: book.imageIds,
      },
    },
  });

  return images;
};

module.exports = { fetchImagesForBook };
