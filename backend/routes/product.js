const express = require('express');
const {User} = require("../database/models/user");
const {Product} = require("../database/models/product");
const multer  = require('multer')
const {getLockerList} = require("../utils/SintraApiUtils");
const {UserBorrowProduct} = require("../database/models/userBorrowProduct");
const {Op} = require("sequelize");
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
                token: req.get('Auth-Token'),
                lockerList: {
                    [Op.not]: null
                }
            }
        });
        if (user){
            const productInfo = {
                idOwner: user.id,
                title: req.body.title,
                description: req.body.description,
                maxLoanDays: req.body.maxLoanDays,
            }
            const product = await Product.create(productInfo)
            res.json({id: product.id});
        } else {
            res.sendStatus(403); // Forbidden
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

router.post('/:id/updateImage', upload.single('image'), async function (req, res) {
    try {
        //If user doesn't own the product return unauthorized
        if (!(await checkOwner(req.get('Auth-Token'), req.params.id))) {
            res.sendStatus(403) // Forbidden
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
        if (image && image.picture) {
            res.write(image.picture)
            res.end()
        } else {
          res.redirect('/empty.jpg')
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

router.put('/:id', async function (req, res) {
    if (!(checkParams(req) && req.body.hasOwnProperty('availability'))) {
        res.sendStatus(400);
        return
    }
    //If user doesn't own the product return unauthorized
    if (!(await checkOwner(req.get('Auth-Token'), req.params.id))) {
        res.sendStatus(403)
        return;
    }
    //Check that product is not lent (terminationDate date is null)
    const loan = await UserBorrowProduct.findOne({
        where: {
            idProduct: req.params.id,
            terminationDate: {
                [Op.is]: null,
            }
        }
    })
    //If exists a loan with terminationDate null, return forbidden
    if (loan){
        res.sendStatus(403)
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
        const productObj = {product}
        res.json(productObj);
    } catch (error) {
        console.error(error)
        res.sendStatus(500);
    }
});

//Check request params
function checkParams(req){
    const body = req.body;
    if (!(body.hasOwnProperty('title') && body.hasOwnProperty('description')
        && body.hasOwnProperty('maxLoanDays')))
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
        if (products) {
            for (let i = 0; i < products.products.length; i++) {
                if (products.products[i].id == idProduct) {
                  exists = !exists
                  break
                }
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
