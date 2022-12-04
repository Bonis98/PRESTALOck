const express = require('express');
const {User} = require("../database/models/user");
const {getLockerList} = require("../utils/SintraApiUtils");
const {Product} = require("../database/models/product");
const router = express.Router();

router.get('/:id', async function (req, res) {
    try {
        const user = await User.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ['id', 'name', 'surname', 'province', 'lockerList']
        })
        if (user) {
            user.dataValues['lockerList'] = await getLockerList(user.lockerList);
            let userInfo = {user};
            res.json(userInfo)
        } else {
            res.sendStatus(404)
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.get('/:id/products', async function(req, res){
    try {
        const products = await Product.findAll({
            where: {
                idOwner: req.params.id
            },
            attributes: {
                exclude: ['idOwner', 'picture', 'createdAt', 'updatedAt']
            },
            include: {
                model: User,
                required: true,
                attributes: ['id', 'name', 'surname', 'province', 'lockerList']
            }
        });
        let product;
        for (product of products){
            product.dataValues['lockerList'] = await getLockerList(product.user.lockerList);
            delete product.user.dataValues.lockerList;
        }
        const productsByOwner = {products};
        res.json(productsByOwner);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});
module.exports = router; //eof
