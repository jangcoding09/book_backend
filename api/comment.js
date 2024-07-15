require("dotenv").config();
const express = require("express");
const {
  getcommentsForBook,
  postcomment,
  patchcomment,
  deletecomment,
  getcomments,
  deleteCommentByRole,
} = require("../controllers/commentController");
const { connectDB } = require("../config/db");
const authenticate = require("../middleware/authMiddleware");

const app = express();
app.use(express.json());

connectDB();

app.get("/api/comment/:bookId", async (req, res) => {
  await getcommentsForBook(req, res);
});

app.get("/api/comment", async (req, res) => {
  await getcomments(req, res);
});

app.post("/api/comment/:bookId", authenticate, async (req, res) => {
  await postcomment(req, res);
});

app.patch("/api/comment/:bookId/:commentId", authenticate, async (req, res) => {
  await patchcomment(req, res);
});

app.delete(
  "/api/comment/:bookId/:commentId",
  authenticate,
  async (req, res) => {
    await deletecomment(req, res);
  }
);

app.delete(
  "/api/comment/role/:commentId/:userId",
  authenticate,
  async (req, res) => {
    await deleteCommentByRole(req, res);
  }
);

module.exports = app;
