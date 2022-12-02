const express = require("express");
const {Product} = require ("../database/models/product");
const {UserBorrowProduct} = require("../database/models/userBorrowProduct");
const {User} = require("../database/models/user");
const fetch = require("node-fetch");
const moment = require("moment");
const sendMail = require("../utils/mailUtils");
const {Op} = require("sequelize");
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

router.get('/start/:idProduct', async function (req, res) {
    let receiverUnlockCode;
    let slotIndex;
    try {
        const currentUser = await User.findOne({
            where: {
                token: req.get('Auth-Token')
            },
            attributes: ['id', 'email', 'name', 'surname']
        })
        const product = await Product.findOne({
            where: {
                id: req.params.idProduct,
                idOwner: currentUser.id
            },
            attributes: ['id', 'maxLoanDays', 'title']
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
        await checkDuplicate(product)
        let url = 'http://hack-smartlocker.sintrasviluppo.it/api/slots/' + borrower.lockerSlot;
        const resp = await fetch(url, {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        })
        const jsonData = await resp.json()
        receiverUnlockCode = jsonData.status.unlockCodes[1]
        let lockerId = jsonData.lockerId
        slotIndex = jsonData.index

        //retrieving complete lockers list
        let lockerList = await fetch('http://hack-smartlocker.sintrasviluppo.it/api/lockers', {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        });

        lockerList = await lockerList.json();
        //retrieve locker data -> send its name and address through email
        let locker;
        for (let i=0; i<lockerList.length; i++){
            if (lockerList[i].id == lockerId){
                locker = lockerList[i]
                break
            }
        }

        await UserBorrowProduct.update({
            loanStartDate: moment(new Date(), moment.ISO_8601)
        }, {
            where: {
                idProduct: product.id,
                terminationDate: null
            },
        })
        let emailSubject = "L'oggetto prenotato è pronto per il ritiro"
        let returningDate = moment().add(10, 'days').locale('it').calendar({
            sameDay: '[Oggi]',
            nextDay: '[Domani]',
            nextWeek: 'dddd',
        })
        let emailText = currentUser.name + " " + currentUser.surname + " ha depositato l'oggetto " +
            product.title + " nello slot " + slotIndex + " del locker " + locker.nome + " in " + locker.address +
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

router.get('/close/:idProduct', async function(req, res){
    try {

        UserBorrowProduct.findOne({
            where: {
                idProduct: req.params.idProduct,
                loanStartDate: {
                    [Op.not]: null
                },
                terminationDate: null
            }
        })
    //TODO: finish route
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

module.exports = router;
