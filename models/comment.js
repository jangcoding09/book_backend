const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db").sequelize;

class Comment extends Model {}

Comment.init(
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
    content: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Book",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "Comment",
    schema: "public",
    tableName: "Comments",
    timestamps: true,
  }
);

module.exports = Comment;
