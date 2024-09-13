// migrations/YYYYMMDDHHMMSS-add-likeCount-to-stories.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Stories", "likeCount", {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Stories", "likeCount");
  },
};
