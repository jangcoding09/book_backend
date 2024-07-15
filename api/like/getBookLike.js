const { getBookLike } = require("../../controllers/likeController");
const connectDB = require("../../config/db");

module.exports = async (req, res) => {
  await connectDB();
  getBookLike(req, res);
};
