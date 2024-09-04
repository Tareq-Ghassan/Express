const Sequelize = require('sequelize');

const sequelize= require('../helper/database');

const CartItem = sequelize.define('cartItem',{
    id: {
        type: Sequelize.CHAR(36),
        allowNull: true, // WE are generating the id form database trigger
        primaryKey: true
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = CartItem;