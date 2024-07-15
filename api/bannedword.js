const express = require("express");
const {
  addBannedWord,
  deleteBannedWord,
  getBannedWords,
} = require("../controllers/bannedwordController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", async (req, res) => {
  await getBannedWords(req, res);
});

router.post("/", authenticate, async (req, res) => {
  await addBannedWord(req, res);
});

router.delete("/:id", authenticate, async (req, res) => {
  await deleteBannedWord(req, res);
});

module.exports = router;
