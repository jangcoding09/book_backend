"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 컬럼 이름 변경
    await queryInterface.renameColumn(
      {
        tableName: "GptLikes",
        schema: "public",
      },
      "gptstoryId",
      "storyId"
    );

    // storyId 컬럼의 속성 변경
    await queryInterface.changeColumn(
      {
        tableName: "GptLikes",
        schema: "public",
      },
      "storyId",
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Stories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    // 컬럼 이름을 원래대로 변경
    await queryInterface.renameColumn(
      {
        tableName: "GptLikes",
        schema: "public",
      },
      "storyId",
      "gptstoryId"
    );

    // gptstoryId 컬럼의 속성 원래대로 변경
    await queryInterface.changeColumn(
      {
        tableName: "GptLikes",
        schema: "public",
      },
      "gptstoryId",
      {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Stories",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      }
    );
  },
};
