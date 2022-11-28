const express = require("express");
const {Product} = require ("../database/models/product");
const {UserBorrowProduct} = require("../database/models/userBorrowProduct");
const {User} = require("../database/models/user");
const fetch = require("node-fetch");
const moment = require("moment");
const sendMail = require("../nodemailer/src/send-mail");
const router = express.Router();

async function checkDuplicate(product){
    const numberOfOccurrences = await UserBorrowProduct.count({
        where:{
            idProduct: product.id,
            loanStartDate: null,
            terminationDate: null
        }
    })
    if (numberOfOccurrences != 1){
        throw new Error("Found wrong number of occurrences in UserBorrowProduct table")
    }
}

router.get('/:idProduct', async function (req, res) {
    let receiverUnlockCode;
    try {
        const currentUser = await User.findOne({
            where: {
                token: req.get('Auth-Token')
            },
            attributes: ['id, email, name, surname']
        })
        const product = await Product.findOne({
            where: {
                id: req.params.idProduct,
                idOwner: currentUser.id
            },
            attributes: ['id', 'maxLoanDays', 'title']
        })
        await checkDuplicate(product)
        let url = 'http://hack-smartlocker.sintrasviluppo.it/api/slots/' + req.params.idProduct.toString();
        const resp = await fetch(url, {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        })
        const jsonData = await resp.json()
        receiverUnlockCode = jsonData.status.unlockCodes[1]
        await UserBorrowProduct.update({
            loanStartDate: moment(new Date(), moment.ISO_8601)
        }, {
            where: {
                idProduct: product.id,
                terminationDate: null
            },
        })
        const borrower = await UserBorrowProduct.findOne({
            where: {
                idProduct: product.id,
                terminationDate: null
            },
            attributes: ['lockerSlot'],
            include: [{
                model: User,
                required: true,
                attributes: ['email']
            }]
        })
        let emailSubject = "L'oggetto prenotato è pronto per il ritiro"
        let returningDate = moment().add(10, 'days').locale('it').calendar({
            sameDay: '[Oggi]',
            nextDay: '[Domani]',
            nextWeek: 'dddd',
        })
        let emailText = currentUser.name + " " + currentUser.surname + " ha depositato l'oggetto " +
            product.title + " nello slot " + borrower.lockerSlot +
            ". Il codice per aprire lo sportello e accedere al ritiro è il seguente: " +
            receiverUnlockCode + ". Ti ricordiamo che il prodotto dovrà essere restituito entro " +
            returningDate + "."
        let mailObjReceiver = {
            from: process.env.MAIL_USER,
            to: borrower.user.email,
            subject: emailSubject,
            text: emailText
        }
        await sendMail(mailObjReceiver)
        emailSubject = "Conferma inizio prestito"
        emailText = "Hai depositato il tuo oggetto con successo. " +
            "Da oggi inizia ufficialmente il periodo di prestito."
        let mailObjOwner = {
            from: process.env.MAIL_USER,
            to: currentUser.email,
            subject: emailSubject,
            text: emailText
        }
        await sendMail(mailObjOwner)
        res.sendStatus(200)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

module.exports = router;
