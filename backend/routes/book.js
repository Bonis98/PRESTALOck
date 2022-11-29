const express = require("express");
const {Product} = require ("../database/models/product");
const moment = require("moment");
const fetch = require("node-fetch");
const {UserBorrowProduct} = require("../database/models/userBorrowProduct");
const {User} = require("../database/models/user");
const sendMail = require("../utils/mailUtils");
const router = express.Router();

class NoSlotError extends Error {
    constructor(args){
        super(args);
        this.name = "NoSlotError"
    }
}


router.post('/', async function (req, res) {
    let UserBorrowProductData;
    let bodyPostBook;

    async function findUserInDB() {
        return await User.findOne({
            where: {
                token: req.get('Auth-Token')
            },
            attributes: ['id', 'name', 'surname', 'email']
        })
    }


    function searchSlot(json) {
        let slotData;
        for (let i = 0; i < json.length; i++) {
            if (json[i].status.booked === false) {
                slotData = json[i];
                return slotData;
            }
        }
    }


    async function checkNoActiveBook(product) {
        const numberOfOccurrences = await UserBorrowProduct.count({
            where: {
                idProduct: product.id,
                terminationDate: null
            }
        })
        if (numberOfOccurrences > 0) {
            throw new Error("Found active book of the same product in UserBorrowProduct table")
        }
    }


    try {
        const product = await Product.findOne({
            where: {
                id: req.productId,
                availability: true
            }, //TODO: define attributes
            include: [{
                model: User,
                required: true,
                attributes: ['email']
            }]
        });

        await checkNoActiveBook(product);

        const userReceiver = await findUserInDB();

        let url = 'http://hack-smartlocker.sintrasviluppo.it/api/slots?lockerId=' + req.body.lockerId.toString();
        const resp = await fetch(url, {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        });

        const jsonData = await resp.json();
        /*for(let i = 0; i < jsonData.length; i++){
            if (jsonData[i].status.booked === false){
                slotData = jsonData[i];
                postBookApi(bodyPostBook);
                break;
            }
        }*/
        let slot = await searchSlot(jsonData)
        //await searchSlot(json, bodyPostBook);
        if (!slot) {
            throw new NoSlotError("No available slots found.")
        }

        bodyPostBook = {
            customerId: userReceiver.id,
            customerName: userReceiver.name,
            slotId: slot.id,
            slotContent: product.title
        }

        const respPost = await fetch('http://hack-smartlocker.sintrasviluppo.it/api/book', {
            method: 'post',
            body: bodyPostBook,
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT,
                'Content-Type': 'application/json'
            }
        })
        console.log(respPost) // needed to understand response --> maybe insert check on status response

        await Product.update({
            availability: false
        }, {
            where: {
                id: product.id
            }
        });

        UserBorrowProductData = {
            idUser: userReceiver.id,
            idProduct: product.id,
            requestDate: moment(new Date(), moment.ISO_8601),
            lockerSlot: slot.id
        }

        //creating new entry in UserBorrowProduct (new book)
        await UserBorrowProduct.create(UserBorrowProductData)

        //retrieving slot unlock code for product owner
        url = 'http://hack-smartlocker.sintrasviluppo.it/api/slots/' + slot.id.toString();
        const respCode = await fetch(url, {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        })
        const jsonSlotData = await respCode.json()
        let receiverUnlockCode = jsonSlotData.status.unlockCodes[0]

        //setting email for reciever
        let emailSubject = "Prenotazione confermata"
        let emailText = "Il proprietario dell'oggetto è stato notificato della richiesta di prestito. " +
            "Ti verrà inviata una seconda mail quando l'oggetto sarà pronto per il ritiro."
        const mailObjReceiver = {
            from: process.env.MAIL_USER,
            to: userReceiver.email,
            subject: emailSubject,
            text: emailText
        }
        await sendMail(mailObjReceiver);

        //setting email for owner
        emailSubject = "Richiesta di prestito"
        emailText = "L'oggetto " + product.title + " è stato prenotato. Recati al locker e depositalo nello slot " +
            slot.id + ". Il codice per aprire lo slot è il seguente: " + receiverUnlockCode + "."
        const mailObjOwner = {
            from: process.env.MAIL_USER,
            to: product.user.email,
            subject: emailSubject,
            text: emailText
        }
        await sendMail(mailObjOwner);

    } catch (e) {
        if (e instanceof NoSlotError) {
            console.error(e.message);
            res.sendStatus(409);
        } else {
            console.log(e);
            res.sendStatus(500);
        }
    }
})

module.exports = router;