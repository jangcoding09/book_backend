const express = require("express");
const router = express.Router();

const { getMyFavorites } = require("../controllers/favoriteController");
const authenticate = require("../middleware/authMiddleware");

router.get("/", authenticate, getMyFavorites);

module.exports = router;
