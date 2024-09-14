// migrations/20240904153610-add-likeCount-to-stories.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Stories", "imageIds", {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: [],
    });
  },
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Books", "imageIds", {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: [],
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Stories", "imageIds");
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("Books", "imageIds");
  },
};
