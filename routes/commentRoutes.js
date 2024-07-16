const express = require("express");
const router = express.Router();

const {
  getcommentsForBook,
  getcomments,
  postcomment,
  patchcomment,
  deletecomment,
  deleteCommentByRole,
} = require("../controllers/commentController");
const authenticate = require("../middleware/authMiddleware");
router.get("/:bookId", getcommentsForBook);
router.get("/", getcomments);
router.post("/:bookId", authenticate, postcomment);
router.patch("/:bookId/:commentId", authenticate, patchcomment);
router.delete("/:bookId/:commentId", authenticate, deletecomment);
router.delete("/role/:commentId/:userId", authenticate, deleteCommentByRole);
module.exports = router;
