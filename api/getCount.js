const { getCount } = require("../controllers/statisticController");
const { connectDB } = require("../config/db");

module.exports = async (req, res) => {
  await connectDB();
  getCount(req, res);
};
