const express = require("express");
const router = express.Router();

const {
  getbook,
  getbooks,
  postbook,
  deletebook,
  patchbook,
  incrementClicks,
} = require("../controllers/bookController");
const authenticate = require("../middleware/authMiddleware");

router.get("/:id", getbook);
router.get("/", getbooks);
router.post("/", authenticate, postbook);
router.delete("/:id", authenticate, deletebook);
router.patch("/:id", authenticate, patchbook);
router.patch("/increment-clicks/:id", authenticate, incrementClicks);

module.exports = router;
