const express = require("express");
const router = express.Router();

const {
  addBannedWord,
  deleteBannedWord,
  getBannedWords,
} = require("../controllers/bannedwordController");

const authenticate = require("../middleware/authMiddleware");

router.get("/", getBannedWords);
router.post("/", authenticate, addBannedWord);
router.delete("/:id", authenticate, deleteBannedWord);

module.exports = router;
