"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName: "Books",
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
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        clicks: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        isSecret: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        category: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        authorName: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        userId: {
          type: Sequelize.UUID,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        imageIds: {
          type: Sequelize.JSON,
          allowNull: true,
        },
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Books");
  },
};
