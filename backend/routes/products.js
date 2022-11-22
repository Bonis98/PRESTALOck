const express = require("express");
const {Product} = require ("../database/models/product");
const {User} = require("../database/models/user");
const {Sequelize} = require("sequelize");
const router = express.Router();


router.get('/', function (req, res) {
    Product.findAll({
        where: {
            availability: true
        },
        attributes: {
            exclude: ['picture', 'availabiltiy', 'createdAt', 'updatedAt']
        },
        include: {
            model: User,
            attributes: [['name', 'ownerName'], ['surname', 'ownerSurname']]
        }
    }).then(function (products) {
        res.status(200).json(products);
    }).catch(error =>{
        console.error(error);
        res.sendStatus(500);
    });
});

module.exports = router;