const express = require("express");
const router = express.Router();

const {
  getMyFavoriteBooks,
  getMyFavoriteStories,
} = require("../controllers/favoriteController");
const authenticate = require("../middleware/authMiddleware");

router.get("/books", authenticate, getMyFavoriteBooks);
router.get("/stories", authenticate, getMyFavoriteStories);
module.exports = router;
