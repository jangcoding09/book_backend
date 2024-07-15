const { getUsers } = require("../../controllers/usersController");
const connectDB = require("../../config/db");

module.exports = async (req, res) => {
  await connectDB();
  getUsers(req, res);
};
