const express = require('express');
const {User} = require("../database/models/user");
const {Product} = require("../database/models/product");
const router = express.Router();

router.post('/', function (req, res){
    if (!checkParams(req)){
        res.sendStatus(400);
        return
    }
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
});
//Check request params
function checkParams(req){
    const body = req.body;
    if (!(body.hasOwnProperty('title') && body.hasOwnProperty('description') && body.hasOwnProperty('maxLoanDays')))
        return false
    if (body.title.length == 0)
        return false
    if (body.description.length == 0)
        return false
    if (body.maxLoanDays <= 0)
        return false
    return true
}

module.exports = router; //eof
