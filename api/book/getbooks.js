const { getbooks } = require("../../controllers/bookController");
const connectDB = require("../../config/db");

module.exports = async (req, res) => {
  await connectDB();
  getbooks(req, res);
};
