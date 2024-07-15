require("dotenv").config();
const express = require("express");
const {
  addBannedWord,
  deleteBannedWord,
  getBannedWords,
} = require("../controllers/bannedwordController");
const { connectDB } = require("../config/db");
const authenticate = require("../middleware/authMiddleware");

const app = express();
app.use(express.json());

connectDB();

app.get("/api/bannedword", async (req, res) => {
  await getBannedWords(req, res);
});

app.post("/api/bannedword", authenticate, async (req, res) => {
  await addBannedWord(req, res);
});

app.delete("/api/bannedword/:id", authenticate, async (req, res) => {
  await deleteBannedWord(req, res);
});

module.exports = app;
