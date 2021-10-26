const dotenv = require("dotenv");
const { Sequelize } = require("sequelize");

dotenv.config();
const {
  DATABASE_ENGINE,
  DATABASE_CONNECTION_STRING,
  DATABASE_HOST,
  DATABASE_PASSWORD,
  DATABASE_USERNAME,
  DATABASE_PORT,
  DATABASE_NAME,
} = process.env;

// If process.env.DATABASE_CONNECTION_STRING is present just use ConnectionString
const dbArgs = DATABASE_CONNECTION_STRING
  ? [ DATABASE_CONNECTION_STRING ]
  : [
    DATABASE_NAME,
    DATABASE_USERNAME,
    DATABASE_PASSWORD,
    {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      dialect: DATABASE_ENGINE,
    }
  ];
const datasource = new Sequelize(...dbArgs);

module.exports = datasource;