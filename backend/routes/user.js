const express = require('express');
const {User} = require("../database/models/user");
const {getLockerList} = require("../utils/SintraApiUtils");
const {Product} = require("../database/models/product");
const router = express.Router();

router.get('/:id', function (req, res){
    User.findOne({
        where: {
            id: req.params.id,
        },
        attributes: ['id', 'name', 'surname', 'province', 'lockerList']
    }).then(async (user) => {
        user.dataValues['lockerList'] = await getLockerList(user.lockerList);
        let userInfo = {user}
        res.json(userInfo)
    }, (error) => {
        console.error(error);
        res.sendStatus(500);
    })
})

router.get('/:id/products', async function(req, res){
    try {
        const products = await Product.findAll({
            where: {
                idOwner: req.params.id
            },
            attributes: {
                exclude: ['picture', 'createdAt', 'updatedAt']
            },
            include: {
                model: User,
                required: true,
                attributes: ['name', 'surname', 'province', 'lockerList']
            }
        });
        let product;
        for (product of products){
            product.dataValues['lockerList'] = await getLockerList(product.user.lockerList);
            delete product.user.dataValues.lockerList;
        }
        const productsByOwner = {products}
        res.json(productsByOwner);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})
module.exports = router; //eof
