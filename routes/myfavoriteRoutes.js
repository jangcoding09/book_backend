const express = require("express");
const router = express.Router();

const { getMyFavorites } = require("../controllers/favoriteController");

router.get("/:id", getMyFavorites);

module.exports = router;
