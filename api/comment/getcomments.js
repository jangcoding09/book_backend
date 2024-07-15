const { getcomments } = require("../../controllers/commentController");
const connectDB = require("../../config/db");

module.exports = async (req, res) => {
  await connectDB();
  getcomments(req, res);
};
