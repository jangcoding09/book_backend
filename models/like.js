const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db").sequelize;

class Like extends Model {}

Like.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    userIds: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: true,
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
    modelName: "Like",
    schema: "public",
    tableName: "Likes",
    timestamps: true,
  }
);

module.exports = Like;
