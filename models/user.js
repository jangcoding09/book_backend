const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/db").sequelize;

class User extends Model {}

User.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    followerCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    followeeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    valid_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM("ADMIN", "MANAGER", "USER"),
      defaultValue: "USER",
    },
    profileImg: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "User",
    schema: "public",
    tableName: "Users",
    timestamps: true,
  }
);

module.exports = User;
