const { Sequelize} = require('sequelize');
const e = require("express");
const sequelize = new Sequelize({
    logging: false,
    dialect: 'sqlite',
    storage: 'database/sintra.sqlite'
});

sequelize.authenticate().then(() => {
    console.log('Connection to database has been established successfully!')
}, (error) => {
    console.error('Unable to connect to database ', error)
})

module.exports.sequelize = sequelize;
