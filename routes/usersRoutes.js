const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");

const {
  getUsers,
  patchUser,
  deleteUser,
  getUser,
} = require("../controllers/usersController");
// const authenticate = require("../middleware/authMiddleware");
// 유저 삭제는 권한을 role이 admin인 사람만 권한이 있음!!
// role을 검증하는 과정이 필요함
router.delete("/delete/:id", authenticate, deleteUser);
router.get("/", getUsers);
router.get("/userinfo/:id", getUser);
router.patch("/update", authenticate, patchUser);
module.exports = router;
