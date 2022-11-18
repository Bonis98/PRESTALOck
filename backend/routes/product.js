const express = require('express');
const {User} = require("../database/models/user");
const {Product} = require("../database/models/product");
const router = express.Router();

router.post('/', function (req, res){
    User.findOne({
        where: {
            token: req.get('token'),
        }
    }).then((user) => {
        const productInfo = {
            idOwner: user.id,
            title: req.body.title,
            description: req.body.description,
            maxLoanDays: req.body.maxLoanDays,
        }
        Product.create(productInfo).then((product) => {
            res.json({id: product.id});
        }, (error) => {
            console.error(error);
            res.sendStatus(500);
        })
    }, (error) => {
        console.error(error);
        res.sendStatus(500);
    })
})
module.exports = router; //eof
