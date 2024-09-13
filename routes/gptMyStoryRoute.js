const express = require("express");
const router = express.Router();

const {
  getMyStories,
  getMyStory,
  patchDisclosure,
} = require("../controllers/gptMyStoryController");
const authenticate = require("../middleware/authMiddleware");

router.get("/:userId", authenticate, getMyStories);
router.get("/mystory/:id", authenticate, getMyStory);
router.patch("/secret/:id", authenticate, patchDisclosure);
module.exports = router;
