const Sequelize = require('sequelize');

const sequelize= require('../helper/database');

const Cart = sequelize.define('cart',{
    id: {
        type: Sequelize.CHAR(36),
        allowNull: true, // WE are generating the id form database trigger
        primaryKey: true
    },
});

module.exports = Cart;