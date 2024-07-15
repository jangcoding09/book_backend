require("dotenv").config();
const express = require("express");
const {
  deletebook,
  getbook,
  getbooks,
  incrementClicks,
  patchbook,
  postbook,
} = require("../../controllers/bookController");
const connectDB = require("../../config/db");
const authenticate = require("../../middleware/authMiddleware");

const app = express();
app.use(express.json());

connectDB();

app.get("/api/book/:id", async (req, res) => {
  await getbook(req, res);
});

app.get("/api/book", async (req, res) => {
  await getbooks(req, res);
});

app.post("/api/book", authenticate, async (req, res) => {
  await postbook(req, res);
});

app.delete("/api/book/:id", authenticate, async (req, res) => {
  await deletebook(req, res);
});

app.patch("/api/book/:id", authenticate, async (req, res) => {
  await patchbook(req, res);
});

app.patch("/api/book/increment-clicks/:id", authenticate, async (req, res) => {
  await incrementClicks(req, res);
});

module.exports = app;
