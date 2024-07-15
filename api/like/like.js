require("dotenv").config();
const express = require("express");
const {
  addLike,
  getBookLike,
  removeLike,
} = require("../../controllers/likeController");
const connectDB = require("../../config/db");
const authenticate = require("../../middleware/authMiddleware");

const app = express();
app.use(express.json());

connectDB();

app.get("/api/like/:bookId/:id", async (req, res) => {
  await getBookLike(req, res);
});

app.patch("/api/like/add/:bookId/:id", authenticate, async (req, res) => {
  await addLike(req, res);
});

app.patch("/api/like/remove/:bookId/:id", authenticate, async (req, res) => {
  await removeLike(req, res);
});

module.exports = app;
