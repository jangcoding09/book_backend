const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db").sequelize;

class GptLike extends Model {}

GptLike.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    userIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "GptLike",
    schema: "public",
    tableName: "GptLikes",
    timestamps: true,
  }
);

module.exports = GptLike;
