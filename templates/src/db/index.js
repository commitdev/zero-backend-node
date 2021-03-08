const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");

dotenv.config();
const {
  DATABASE_ENGINE,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_USERNAME,
  DATABASE_PORT,
  DATABASE_NAME,
} = process.env;

const datasource = new Sequelize(
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: DATABASE_ENGINE,
  }
);

module.exports = datasource;