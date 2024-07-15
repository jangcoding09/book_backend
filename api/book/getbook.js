const { getbook } = require("../../controllers/bookController");
const connectDB = require("../../config/db");

module.exports = async (req, res) => {
  await connectDB();
  getbook(req, res);
};
