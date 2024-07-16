require("dotenv").config();
const { URL } = require("url");

const databaseUrl = new URL(process.env.POSTGRES_URL);

module.exports = {
  development: {
    username: databaseUrl.username,
    password: databaseUrl.password,
    database: databaseUrl.pathname.split("/")[1],
    host: databaseUrl.hostname,
    port: databaseUrl.port,
    schema: "public", // 스키마 지정
    dialect: "postgres",
    dialectModule: require("pg"), // pg 모듈
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT || 5432,
    schema: "public", // 스키마 지정
    dialect: "postgres",
    dialectModule: pg,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
