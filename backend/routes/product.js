const express = require('express');
const {User} = require("../database/models/user");
const {Product} = require("../database/models/product");
const fetch = require("node-fetch");
const fs = require('fs');
const router = express.Router();

router.post('/', async function (req, res) {
    if (!checkParams(req)) {
        res.sendStatus(400);
        return
    }
    try {
        const user = await User.findOne({
            where: {
                token: req.get('token'),
            }
        });
        const productInfo = {
            idOwner: user.id,
            title: req.body.title,
            description: req.body.description,
            maxLoanDays: req.body.maxLoanDays,
        }
        const product = await Product.create(productInfo)
        res.json({id: product.id});
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.put('/:id', function (req, res, next){
    if (!checkParams(req)){
        res.sendStatus(400);
        return
    }
    Product.update({
        title: req.body.title,
        description: req.body.description,
        maxLoanDays: req.body.maxLoanDays,
        availability: req.body.availability,
    }, {
        where: {
            id: req.params.id,
        }
    }).then(() => res.sendStatus(200), (error) => {
        console.error(error);
        res.sendStatus(500);
    })
});

router.get('/:id', async function (req, res, next) {
    try {
        const product = await Product.findOne({
            where: {
                id: req.params.id,
            },
            include: [{
                model: User,
                required: true,
                attributes: ['name', 'surname', 'province', 'lockerList']
            }],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'picture'],
            }
        });
        const lockerList = await getLockerList(product.user.lockerList);
        product.dataValues['lockerList'] = lockerList;
        delete product.user.dataValues.lockerList;
        res.json(product);
    } catch (error) {
        console.error(error)
        res.sendStatus(500);
    }
});

//Filter out lockers list by user's lockers
function getLockerList(list){
    //Convert string of ids (1;2;) to int array
    const lockerList = String(list).substring(0,list.length-1).split(';').map(Number);
    let UserLockersList = {}
    return new Promise((resolve, reject) => {
        //retrieving complete lockers list, parsing it and sending it for filtering
        fetch('http://hack-smartlocker.sintrasviluppo.it/api/lockers', {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        }).then((resp) => {
            resp.json().then((jsonData) => {
                for (let key in jsonData) {
                    //Copy only user's lockers
                    if (lockerList.includes(jsonData[key].id)) {
                        UserLockersList[key] = jsonData[key]
                    }
                }
                resolve(UserLockersList);
            }, (error) => {
                reject(error);
            })
        }, (error) => {
            reject(error);
        });
    });
}

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
