const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db").sequelize;

class GptComment extends Model {}

GptComment.init(
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
    storyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Story",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "GptComment",
    schema: "public",
    tableName: "GptComments",
    timestamps: true,
  }
);

module.exports = GptComment;
