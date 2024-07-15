const { getMyFavorites } = require("../controllers/favoriteController");
const { connectDB } = require("../config/db");
const authenticate = require("../middleware/authMiddleware");

module.exports = async (req, res) => {
  await connectDB();
  authenticate(req, res, () => getMyFavorites(req, res));
};
