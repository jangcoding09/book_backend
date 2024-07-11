const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db").sequelize;

class Bannedword extends Model {}

Bannedword.init(
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
    word: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Bannedword",
    schema: "public",
    tableName: "Bannedwords",
    timestamps: true,
  }
);
