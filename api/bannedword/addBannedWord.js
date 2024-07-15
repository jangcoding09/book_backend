const { addBannedWord } = require("../../controllers/bannedwordController");
const connectDB = require("../../config/db");
const authenticate = require("../../middleware/authMiddleware");

module.exports = async (req, res) => {
  await connectDB();
  authenticate(req, res, () => addBannedWord(req, res));
};
