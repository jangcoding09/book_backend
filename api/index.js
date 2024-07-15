const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();
const { connectDB } = require("../config/db");

const authRouter = require("./auth");
const bookRouter = require("./book");
const commentRouter = require("./comment");
const bannedwordRouter = require("./bannedword");
const likeRouter = require("./like");
const mailRouter = require("./mail");
const usersRouter = require("./users");
// const getCountRouter = require("./getCount");
// const getMyFavoritesRouter = require("./getMyFavorites");
const imageRouter = require("./image");

const app = express();

connectDB();
// CORS 설정
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // 허용할 도메인 설정
    credentials: true, // 쿠키를 포함한 요청을 허용
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API 라우터 설정
app.use("/api/auth", authRouter);
app.use("/api/book", bookRouter);
app.use("/api/comment", commentRouter);
app.use("/api/bannedword", bannedwordRouter);
app.use("/api/like", likeRouter);
app.use("/api/mail", mailRouter);
app.use("/api/users", usersRouter);
// app.use("/api/statistics", getCountRouter);
// app.use("/api/myfavorites", getMyFavoritesRouter);
app.use("/api/image", imageRouter);

module.exports = app;
