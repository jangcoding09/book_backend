const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");
const sendEmail = require("../services/emailService");

exports.signup = async (req, res) => {
  const { nickname, name, password, email } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      nickname,
      name,
      email,
      password: hashedPassword,
    });

    const emailToken = generateToken(user, "10m"); // 10분 유효시간

    const emailVerificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${emailToken}`;

    await sendEmail(
      email,
      "Email Verification",
      `Please verify your email by clicking on the following link: ${emailVerificationUrl}`
    );

    res.status(201).json({
      accessToken: generateToken(user),
      refreshToken: generateToken(user, "7d"),
      userInfo: {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        profileImg: user.profileImg,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Request Body:", req.body);

  try {
    const user = await User.findOne({ where: { email } });
    console.log("User found:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      accessToken: await generateToken(user),
      refreshToken: await generateToken(user, "7d"),
      userInfo: {
        id: user.id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        profileImg: user.profileImg,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    user.valid_email = true;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAccessToken = async (req, res) => {
  const refreshToken = req.headers.authorization?.split(" ")[1];
  console.log(refreshToken, "refreshtoken");

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required!" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    console.log(decoded, "Decoded token");

    const user = await User.findByPk(decoded.id);
    console.log(user, "User found");

    if (!user) {
      return res.status(400).json({ message: "Invalid Token!" });
    }

    const accessToken = await generateToken(user);
    res.json({ accessToken });
  } catch (error) {
    console.error("Error during token verification:", error.message);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
