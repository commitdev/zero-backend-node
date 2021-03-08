const {Model, DataTypes} = require("sequelize");
const datasource = require("../index");

class Trip extends Model{}

Trip.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    launchId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
},{
    sequelize: datasource,
    tableName: "trip"
});

module.exports = Trip;