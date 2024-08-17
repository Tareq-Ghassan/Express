const Sequelize = require('sequelize');

const sequelize= require('../helper/database');

const Product = sequelize.define('product',{
  id: {
    type: Sequelize.CHAR(36),
    allowNull: true, // WE are generating the id form database trigger
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  }
})

module.exports = Product;

