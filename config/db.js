const { Sequelize } = require("sequelize");
const pg = require("pg");
require("dotenv").config();

const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
};

module.exports = { sequelize, connectDB };
