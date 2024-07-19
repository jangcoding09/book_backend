const { User } = require("../models");
const bcrypt = require("bcryptjs");

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.destroy();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll();

    // Prepare the response object
    const response = {
      status: 200,
    };

    // Add users to the response object
    users.forEach((user, index) => {
      response[index] = user;
    });

    // Send the response with status code 200
    res.status(200).json(response);
  } catch (error) {
    // Handle errors and send a 500 status code
    res.status(500).json({ status: 500, error: error.message });
  }
};
//닉네임, 패스워드, 프로필이미지 등 변경
const patchUser = async (req, res) => {
  try {
    const { nickname, password, profileImgPath, id } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (nickname) user.nickname = nickname;
    if (password) {
      const hashedPassword = await await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (profileImgPath) user.profileImg = [profileImgPath];

    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = { getUsers, patchUser, deleteUser };
