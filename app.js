const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db"); // DB 연결 함수
const OpenAI = require("openai");

const app = express();
const port = process.env.PORT || 5000;

// CSP 설정
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; img-src 'self' data:;"
  );
  next();
});

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : "http://localhost:3000",
    credentials: true,
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
const gptlikeRoutes = require("./routes/gptlikeRoutes");
const usersRoutes = require("./routes/usersRoutes");
const bannedwordRoutes = require("./routes/bannedwordRoutes");
const myfavoriteRoutes = require("./routes/myfavoriteRoutes");
const statisticsRoutes = require("./routes/statisticRoutes");
const gptRoutes = require("./routes/gptRoutes");
const myStoryRoutes = require("./routes/gptMyStoryRoute");
const storyListRoutes = require("./routes/storyListRoutes");
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/book", bookRoutes);
app.use("/fb/image", imageRoutes);
app.use("/comment", commentRoutes);
app.use("/like", likeRoutes);
app.use("/gptlike", gptlikeRoutes);
app.use("/bannedword", bannedwordRoutes);
app.use("/myfavorites", myfavoriteRoutes);
app.use("/statistics", statisticsRoutes);
app.use("/gpt", gptRoutes);
app.use("/mystories", myStoryRoutes);
app.use("/storylists", storyListRoutes);
app.post("/mail/send-code", async (req, res) => {
  const { email } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "유효하지 않은 이메일형식입니다." });
  }

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
      text: `인증번호는 다음과 같습니다.: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    if (!global.verificationCodes) global.verificationCodes = {};
    global.verificationCodes[email] = {
      code: verificationCode,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    res
      .status(200)
      .json({ message: "인증번호가 전송되었습니다. 메일을 확인해주세요!" });
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.responseCode === 550) {
      res.status(404).json({ message: "이메일 주소를 찾을 수 없습니다." });
    } else if (error.code === "EENVELOPE") {
      res.status(400).json({ message: "이메일 주소가 올바르지 않습니다." });
    } else {
      res
        .status(500)
        .json({ message: "인증코드 전송에 실패했습니다.(서버 에러)" });
    }
  }
});

// Handle verification code validation and signup
app.post("/mail/verify-code", async (req, res) => {
  const { email, code } = req.body;

  try {
    if (global.verificationCodes && global.verificationCodes[email]) {
      const storedCode = global.verificationCodes[email].code;

      if (code === storedCode) {
        res.status(200).json({
          message: "인증번호가 일치합니다. 회원가입을 계속 진행하세요.",
        });
      } else {
        res.status(400).json({ message: "인증번호가 일치하지 않습니다." });
      }
    } else {
      res.status(400).json({ message: "인증번호를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ message: "Failed to verify code." });
  }
});

// 404 에러 핸들링
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
module.exports = app;
