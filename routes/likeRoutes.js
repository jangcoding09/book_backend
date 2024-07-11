const express = require("express");
const router = express.Router();

const {
  getBookLike,
  addLike,
  removeLike,
} = require("../controllers/likeController");
const authenticate = require("../middleware/authMiddleware");
router.get("/:bookId/:id", getBookLike);
router.patch("/add/:bookId/:id", authenticate, addLike);
router.patch("/remove/:bookId/:id", authenticate, removeLike);

module.exports = router;
