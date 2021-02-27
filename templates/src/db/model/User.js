const {Model, DataTypes} = require("sequelize");
const datasource = require("../index");

class User extends Model{}

User.init({
    id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    email: DataTypes.STRING,
    token: DataTypes.STRING
},{
    sequelize: datasource,
    tableName: "user"
});

module.exports = User;