const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// CORS 설정
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // 허용할 도메인 설정
    credentials: true, // 쿠키를 포함한 요청을 허용
  })
);

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "..", "build")));

// 모든 경로에 대해 index.html 반환 (프론트엔드 라우팅을 위해)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

module.exports = app;
