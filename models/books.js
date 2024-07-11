const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db").sequelize;

class Book extends Model {}

Book.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    clicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isSecret: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    imageIds: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    likeCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "Book",
    schema: "public",
    tableName: "Books",
    timestamps: true,
  }
);

module.exports = Book;
