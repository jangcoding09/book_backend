"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName: "Comments",
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
        content: {
          allowNull: false,
          type: Sequelize.TEXT,
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "Users",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        bookId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "Books",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Comments");
  },
};
