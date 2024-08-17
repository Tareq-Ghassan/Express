require('dotenv').config(); // Load environment variables

const Sequelize = require('sequelize');

const sequelize = new Sequelize.Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,{
        dialect:'mysql',
        host:process.env.DB_HOST
    }
);

module.exports = sequelize;
