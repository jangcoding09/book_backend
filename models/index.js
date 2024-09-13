const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 모델 간의 연관 관계 설정
db.User.hasMany(db.Book, { foreignKey: "userId", as: "books" });
db.Book.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.User.hasMany(db.Comment, { foreignKey: "userId", as: "comments" });
db.Comment.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.Book.hasMany(db.Comment, { foreignKey: "bookId", as: "comments" });
db.Comment.belongsTo(db.Book, { foreignKey: "bookId", as: "book" });

db.Book.hasMany(db.Like, { foreignKey: "bookId", as: "likes" });
db.Like.belongsTo(db.Book, { foreignKey: "bookId", as: "book" });

db.Story.hasMany(db.GptLike, { foreignKey: "storyId", as: "gptLikes" });
db.GptLike.belongsTo(db.Story, { foreignKey: "storyId", as: "story" });

db.Story.hasMany(db.GptComment, { foreignKey: "storyId", as: "gptComments" });
db.GptComment.belongsTo(db.Story, { foreignKey: "storyId", as: "story" });

db.User.hasMany(db.Story, { foreignKey: "userId", as: "stories" });
db.Story.belongsTo(db.User, { foreignKey: "userId", as: "user" });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
