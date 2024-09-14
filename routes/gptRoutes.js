const express = require("express");
const router = express.Router();

const {
  getStory,
  getStories,
  createTemplate,
  gptchat,
  changeStoryWithGPT,
  patchStoryContent,
  updateStory,
  appendStoryContent,
  deleteStory,
  incrementClicks,
} = require("../controllers/storyController");
const authenticate = require("../middleware/authMiddleware");

router.get("/", getStories);
router.get("/:id", getStory);
router.post("/gptchat", authenticate, gptchat);
router.post("/:id/appendcontent", authenticate, appendStoryContent);
router.post("/changestory", authenticate, changeStoryWithGPT);
router.post("/template", authenticate, createTemplate);
router.patch("/:id/patchcontent", authenticate, patchStoryContent);
router.patch("/:id/updatestory", authenticate, updateStory);
router.patch("/increment-clicks/:id", incrementClicks);
router.delete("/:id", authenticate, deleteStory);
module.exports = router;
