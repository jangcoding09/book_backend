const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/users");
require("dotenv").config();
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
// 미들웨어 설정 (예: JSON 요청 바디를 파싱)
app.use(express.json());

app.use("/api/users", usersRouter);
// 간단한 GET 엔드포인트 설정
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.post("/api/users", (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});
