require("dotenv").config();

module.exports = {
  DATABASE_URI: process.env.POSTGRES_DATABASE_URI,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
