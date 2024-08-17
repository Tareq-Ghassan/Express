const Sequelize = require('sequelize');

const sequelize = require('../helper/database');


const ErrorLog = sequelize.define('ErrorLog',{
    id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true,
        unique:true,
    },
    errorStack:{
        type: Sequelize.TEXT,
        allowNull:false,
    },
    timestamp:{
        type: Sequelize.DATE,
        allowNull:false,
        defaultValue: Sequelize.NOW,
    }
})

module.exports = ErrorLog;