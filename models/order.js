const Sequelize = require('sequelize');

const sequelize= require('../helper/database');

const Order = sequelize.define('order',{
    id: {
        type: Sequelize.CHAR(36),
        allowNull: true, // WE are generating the id form database trigger
        primaryKey: true
    },
});

module.exports = Order;