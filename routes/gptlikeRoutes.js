const express = require("express");
const router = express.Router();

const {
  getStoryLike,
  addLike,
  removeLike,
} = require("../controllers/gptLikeController");
const authenticate = require("../middleware/authMiddleware");
router.get("/:storyId/:id", getStoryLike);
router.patch("/add/:storyId/:id", authenticate, addLike);
router.patch("/remove/:storyId/:id", authenticate, removeLike);

module.exports = router;
