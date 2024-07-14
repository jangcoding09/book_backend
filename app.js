const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db"); // DB 연결 함수
const { exec } = require("child_process");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // 클라이언트의 주소
    credentials: true, // 쿠키를 포함한 요청을 허용
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const imageRoutes = require("./routes/imageRoutes");
const commentRoutes = require("./routes/commentRoutes");
const likeRoutes = require("./routes/likeRoutes");
const usersRoutes = require("./routes/usersRoutes");
const bannedwordRoutes = require("./routes/bannedwordRoutes");
const myfavoriteRoutes = require("./routes/myfavoriteRoutes");
const statisticsRoutes = require("./routes/statisticRoutes");
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/book", bookRoutes);
app.use("/fb/image", imageRoutes);
app.use("/comment", commentRoutes);
app.use("/like", likeRoutes);
app.use("/bannedword", bannedwordRoutes);
app.use("/myfavorites", myfavoriteRoutes);
app.use("/statistics", statisticsRoutes);

// Generate a verification code and send an email
app.post("/mail/send-code", async (req, res) => {
  const { email } = req.body;

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification Code",
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    if (!global.verificationCodes) global.verificationCodes = {};
    global.verificationCodes[email] = {
      code: verificationCode,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    res.status(200).json({ message: "Verification code sent." });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send verification code." });
  }
});

// Handle verification code validation and signup
app.post("/mail/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    if (global.verificationCodes && global.verificationCodes[email]) {
      const storedCode = global.verificationCodes[email].code;

      if (code === storedCode) {
        res
          .status(200)
          .json({ message: "Verification code matched. Proceed with signup." });
      } else {
        res.status(400).json({ message: "Verification code does not match." });
      }
    } else {
      res.status(400).json({ message: "Verification code not found." });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Failed to verify code." });
  }
});

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
