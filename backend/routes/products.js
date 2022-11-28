const express = require("express");
const {Product} = require ("../database/models/product");
const {User} = require("../database/models/user");
const {Op} = require("sequelize");
const router = express.Router();


router.get('/', function (req, res) {
    User.findOne({
        where: {
            token: req.get('Auth-Token')
        }
    }).then(function (currentUser){
        Product.findAll({
            where: {
                availability: true,
                idOwner: {
                    [Op.ne]: currentUser.id
                }
            },
            attributes: {
                exclude: ['picture', 'availability', 'createdAt', 'updatedAt']
            },
            include: {
                model: User,
                as: 'user',
                attributes: ['name', 'surname'],
                where: {
                    province: currentUser.province
                }
            }
        }).then(function (products) {
            res.status(200).json(products);
        })
    }).catch(error =>{
        console.error(error);
        res.sendStatus(500);
    })
});

module.exports = router;