"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName: "Images",
        schema: "public", // 스키마 지정
      },
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        order: {
          type: Sequelize.INTEGER,
        },
        type: {
          type: Sequelize.INTEGER,
        },
        path: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        fbPath: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Images");
  },
};
