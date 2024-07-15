const { incrementClicks } = require("../../controllers/bookController");
const connectDB = require("../../config/db");
const authenticate = require("../../middleware/authMiddleware");

module.exports = async (req, res) => {
  await connectDB();
  authenticate(req, res, () => incrementClicks(req, res));
};
