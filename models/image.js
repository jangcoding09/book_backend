const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db").sequelize;

class Image extends Model {}

Image.init(
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
    order: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fbPath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Image",
    schema: "public",
    tableName: "Images",
    timestamps: true,
  }
);

module.exports = Image;
