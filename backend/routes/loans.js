const express = require("express");
const {UserBorrowProduct} = require("../database/models/userBorrowProduct");
const {User} = require("../database/models/user");
const {Op} = require("sequelize");
const {Product} = require("../database/models/product");
const {getLockerList} = require("../utils/SintraApiUtils");
const router = express.Router();

router.get('/', async function (req, res) {
    try {
        //Extract user id
        const user = await  User.findOne({
            where: {
                token: req.get('Auth-Token')
            }
        })
        const idUser = user.id
        //Extract products borrowed by user
        const borrowedProducts = await UserBorrowProduct.findAll({
            where: {
                idUser: idUser,
                terminationDate:{
                    [Op.is]: null,
                }
            },
            include: {
                model: Product,
                required: true,
            },
            attributes: {
                exclude: ['terminationDate', 'createdAt', 'updatedAt', 'id', 'idUser']
            }
        })
        //Add flags alreadyStarted and myProduct
        borrowedProducts.forEach((product) => {
            product.dataValues.myProduct = false
            if (product.loanStartDate != null){
                product.dataValues.alreadyStarted = true
                const loanStartDate = new Date(product.loanStartDate)
                //Calculate remaining days
                product.dataValues.remainingDays = product.dataValues.product.maxLoanDays - diffDaysNow(loanStartDate)
                //Calculate end date
                product.dataValues.endDate = loanStartDate.addDays(product.dataValues.product.maxLoanDays)
            }
            else
                product.dataValues.alreadyStarted = false
            delete product.dataValues.product
        })
        //Extract products lent by user
        const lentProducts = await UserBorrowProduct.findAll({
            include: {
                model: Product,
                required: true,
                where: {
                    idOwner: idUser
                }
            },
            attributes: {
                exclude: ['terminationDate', 'createdAt', 'updatedAt', 'id', 'idUser']
            }
        })
        lentProducts.forEach((product) => {
            product.dataValues.myProduct = true
            if (product.loanStartDate != null){
                product.dataValues.alreadyStarted = true
                const loanStartDate = new Date(product.loanStartDate)
                product.dataValues.remainingDays = product.dataValues.product.maxLoanDays - diffDaysNow(loanStartDate)
                product.dataValues.endDate = loanStartDate.addDays(product.dataValues.product.maxLoanDays)
            }
            else
                product.dataValues.alreadyStarted = false
            delete product.dataValues.product
        })
        let loans = lentProducts.concat(borrowedProducts)
        loans = {loans}
        res.json(loans)
    }
    catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
});


router.get('/ended', async function(req, res){
    try {
        const currentUser = await User.findOne({
            where: {
                token: req.get('Auth-Token')
            },
            attributes: ['id']
        });

        const loans = await UserBorrowProduct.findAll({
            where:{
                terminationDate: {
                    [Op.not]: null
                }
            },
            attributes: ['id', 'requestDate', 'loanStartDate', 'terminationDate'],
            include: [{
                model: Product,
                required: true,
                where: {
                    idOwner: currentUser.id
                },
                attributes: ['id', 'title']
            },{
                model: User,
                required: true,
                attributes: ['id', 'name', 'surname']
            }
            ]

        });

        let loan;
        for (loan of loans){
            loan.dataValues['borrower'] = loan.user.dataValues;
            delete loan.user.dataValues;
        }
        const allLoansSucceeded = {loans}
        res.json(allLoansSucceeded);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }

});


router.get('/requested', async function(req, res){
    try {
        const currentUser = await User.findOne({
            where: {
                token: req.get('Auth-Token')
            },
            attributes: ['id']
        });
        const loans = await UserBorrowProduct.findAll({
            where: {
                idUser: currentUser.id,
                terminationDate: {
                    [Op.not]: null
                }
            },
            attributes: ['id','requestDate', 'loanStartDate', 'terminationDate'],
            include:{
                model: Product,
                required: true,
                attributes: ['id', 'title'],
                include: {
                    model: User,
                    required: true,
                    attributes: ['id','name', 'surname']
                }
            }
        })

        let loan;
        for (loan of loans){
            loan.dataValues['owner'] = loan.product.user.dataValues;
            delete loan.product.user.dataValues;
        }

        const  allRequestedProducts = {loans}
        res.json(allRequestedProducts);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }

});

//return number of days between now and the date passed
function diffDaysNow(date){
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const now = new Date()
    return Math.floor(Math.abs((now - date) / oneDay))
}

//Add days to a date
Date.prototype.addDays = function(days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}

module.exports = router;
