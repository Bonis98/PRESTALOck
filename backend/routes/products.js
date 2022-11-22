const express = require("express");
const {Product} = require ("../database/models/product");
const {User} = require("../database/models/user");
const router = express.Router();


router.get('/', function (req, res) {
    Product.findAll({
        where: {
            availability: true
        },
        attributes: {
            exclude: ['picture', 'availability', 'createdAt', 'updatedAt']
        },
        include: {
            model: User,
            as: 'user',
            attributes: ['name', 'surname']
        }
    }).then(function (products) {
        res.status(200).json(products);
    }).catch(error =>{
        console.error(error);
        res.sendStatus(500);
    });
});

module.exports = router;