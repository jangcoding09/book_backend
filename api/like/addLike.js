const { addLike } = require("../../controllers/likeController");
const connectDB = require("../../config/db");
const authenticate = require("../../middleware/authMiddleware");

module.exports = async (req, res) => {
  await connectDB();
  authenticate(req, res, () => addLike(req, res));
};
