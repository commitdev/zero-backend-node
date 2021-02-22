const { DataTypes } = require('sequelize');
const db = require("../../db");

module.exports.createStore = () => {
  const users = db.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    email: DataTypes.STRING,
    token: DataTypes.STRING,
  });

  const trips = db.define('trip', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    launchId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
  });

  return { users, trips };
};
