const { deleteCommentByRole } = require("../../controllers/commentController");
const connectDB = require("../../config/db");
const authenticate = require("../../middleware/authMiddleware");

module.exports = async (req, res) => {
  await connectDB();
  authenticate(req, res, () => deleteCommentByRole(req, res));
};
