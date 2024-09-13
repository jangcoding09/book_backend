// migrations/YYYYMMDDHHMMSS-create-users.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      {
        tableName: "Users",
        schema: "public", // 스키마 지정
      },
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        nickname: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        followerCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        followeeCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
        },
        valid_email: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        role: {
          type: Sequelize.ENUM("ADMIN", "MANAGER", "USER"),
          defaultValue: "USER",
        },
        profileImg: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          defaultValue: [],
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
