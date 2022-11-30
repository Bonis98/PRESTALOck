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
        res.json(user)
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
                attributes: ['name', 'surname', 'province', 'lockerList']
            }
        });

        const productsByOwner = {products}
        res.json(productsByOwner);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})
module.exports = router; //eof
