"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "Images", // 테이블 이름
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        order: {
          type: Sequelize.INTEGER,
        },
        type: {
          type: Sequelize.STRING, // 수정된 부분
          allowNull: true, // allowNull이 true로 설정
        },
        size: {
          type: Sequelize.STRING, // 수정된 부분
          allowNull: true, // allowNull이 true로 설정
        },
        name: {
          type: Sequelize.STRING, // 수정된 부분
          allowNull: true, // allowNull이 true로 설정
        },
        path: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        fbPath: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      },
      {
        schema: "public", // 스키마 지정
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Images");
  },
};
