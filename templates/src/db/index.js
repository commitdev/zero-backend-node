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

const database = new Sequelize(
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    dialect: DATABASE_ENGINE,
  }
);

const connect = async () => {
  try {
    await database.authenticate();
    console.log("Connection has been established successfully.");
    return database;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = {
  connect,
};
