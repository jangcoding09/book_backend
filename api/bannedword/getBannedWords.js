const { getBannedWords } = require("../../controllers/bannedwordController");
const connectDB = require("../../config/db");

module.exports = async (req, res) => {
  await connectDB();
  getBannedWords(req, res);
};
