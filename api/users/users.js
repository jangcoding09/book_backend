require("dotenv").config();
const express = require("express");
const { patchUser, getUsers } = require("../../controllers/usersController");
const connectDB = require("../../config/db");
const authenticate = require("../../middleware/authMiddleware");

const app = express();
app.use(express.json());

connectDB();

app.get("/api/users", async (req, res) => {
  await getUsers(req, res);
});

app.patch("/api/users/update", authenticate, async (req, res) => {
  await patchUser(req, res);
});

module.exports = app;
