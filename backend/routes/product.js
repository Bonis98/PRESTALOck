const express = require('express');
const {User} = require("../database/models/user");
const {Product} = require("../database/models/product");
const fetch = require("node-fetch");
const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, fileFilter: fileFilter});
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

router.post('/:id/updateImage', upload.single('picture'), async function (req, res) {
    try {
        //If user doesn't own the product return unauthorized
        if (!(await checkOwner(req.get('token'), req.params.id))) {
            res.sendStatus(401)
            return;
        }
        //Insert image in DB
        await Product.update({picture: req.file.buffer}, {
            where: {
                id: req.params.id,
            }
        })
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

router.get('/:id/image', async function (req, res) {
    try {
        const image = await Product.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['picture']
        });
        res.write(image.picture)
        res.end()
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

router.put('/:id', async function (req, res) {
    if (!checkParams(req)) {
        res.sendStatus(400);
        return
    }
    //If user doesn't own the product return unauthorized
    if (!(await checkOwner(req.get('token'), req.params.id))) {
        res.sendStatus(401)
        return;
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

router.get('/:id', async function (req, res) {
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
        product.dataValues['lockerList'] = await getLockerList(product.user.lockerList);
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

async function checkOwner(token, idProduct) {
    try {
        //Find all id of products of user
        let products = await User.findOne({
            where: {
                token: token,
            },
            include: [{
                model: Product,
                required: true,
                attributes: ['id']
            }],
        });
        //Check that user is updating a product that she owns
        let exists = 0
        for (let i = 0; i < products.Products.length; i++) {
            if (products.Products[i].id == idProduct) {
                exists = !exists
                break
            }
        }
        return exists
    } catch (error) {
        throw new Error(error)
    }
}

//Limit file types to jpeg and png in multer
function fileFilter(req, file, callback){
    if (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
        //res.status(400).json({errorText: "Formato di file non supportato"})
        callback('Gli unici formati accettati sono jpeg e png', false)
    }
    else{
        callback(null, true)
    }
}

module.exports = router; //eof
