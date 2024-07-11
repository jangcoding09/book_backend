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
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    username: databaseUrl.username,
    password: databaseUrl.password,
    database: databaseUrl.pathname.split("/")[1],
    host: databaseUrl.hostname,
    port: databaseUrl.port,
    schema: "public", // 스키마 지정
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
