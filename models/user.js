const Sequelize = require('sequelize');

const sequelize = require('../helper/database');

const User = sequelize.define('user',{
    id: {
        type: Sequelize.INTEGER,
        allowNull: true, // WE are generating the id form database trigger
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = User