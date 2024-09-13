const express = require("express");
const router = express.Router();

const {
  getBestStories,
  getRandomStories,
} = require("../controllers/gptStoryListsController");

router.get("/best", getBestStories);
router.get("/random", getRandomStories);

module.exports = router;
