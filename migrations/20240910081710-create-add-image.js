"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      {
        tableName: "Images",
        schema: "public",
      },
      "type",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );

    await queryInterface.changeColumn(
      {
        tableName: "Images",
        schema: "public",
      },
      "size",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
    await queryInterface.changeColumn(
      {
        tableName: "Images",
        schema: "public",
      },
      "name",
      {
        type: Sequelize.STRING,
        allowNull: true,
      }
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      {
        tableName: "Images",
        schema: "public",
      },
      "size",
      {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      }
    );
    await queryInterface.changeColumn(
      {
        tableName: "Images",
        schema: "public",
      },
      "name",
      {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "제목없음",
      }
    );
    await queryInterface.changeColumn(
      {
        tableName: "Images",
        schema: "public",
      },
      "type",
      {
        type: Sequelize.INTEGER,
        allowNull: true,
      }
    );
  },
};
