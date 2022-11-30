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

    //find current user in DB
    async function findCurrentUserInDB() {
        return await User.findOne({
            where: {
                token: req.get('Auth-Token')
            },
            attributes: ['id', 'name', 'surname', 'email']
        });
    }

    //search and return the first free slot
    function searchSlot(json) {
        let slotData;
        for (let i = 0; i < json.length; i++) {
            if (json[i].status.booked === false) {
                slotData = json[i];
                return slotData;
            }
        }
        return false;
    }

    //check product has no other active book //hookable
    async function checkNoActiveBook(product) {
        const numberOfOccurrences = await UserBorrowProduct.count({
            where: {
                idProduct: product.id,
                terminationDate: null
            }
        });
        if (numberOfOccurrences > 0) {
            throw new Error("Found active book of the same product in UserBorrowProduct table");
        }
    }


    try {

        //find the product requested for book
        const product = await Product.findOne({
            where: {
                id: req.body.productId,
                availability: true
            },
            attributes: ['id', 'idOwner', 'title'],
            include: [{
                model: User,
                required: true,
                attributes: ['email']
            }]
        });

        //if the product does not exist, send status 409 and return
        if (!product){
            res.sendStatus(409);
            return;
        }

        await checkNoActiveBook(product);

        const userReceiver = await findCurrentUserInDB();

        //the receiver cannot be the owner of the requested product //hookable
        if (userReceiver.id === product.idOwner){
            res.sendStatus(409);
            return;
        }

        //retrieve slot list of a locker
        let url = 'http://hack-smartlocker.sintrasviluppo.it/api/slots?lockerId=' + req.body.lockerId;
        const resp = await fetch(url, {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        });

        const jsonData = await resp.json();
        let slot = await searchSlot(jsonData);
        if (!slot) {
            throw new NoSlotError("No available slots found.");
        }

        bodyPostBook = {
            customerId: userReceiver.id,
            customerName: userReceiver.name + " " + userReceiver.surname,
            slotId: slot.id,
            slotContent: product.title
        }

        //book the slot on Sintra API
        const respPost = await fetch('http://hack-smartlocker.sintrasviluppo.it/api/book', {
            method: 'post',
            body: JSON.stringify(bodyPostBook),
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT,
                'Content-Type': 'application/json'
            }
        });

        if (respPost.status != 200){
            res.sendStatus(409);
            return;
        }
        const jsonSlotData = await respPost.json();


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
            lockerSlot: slot.id
        }

        //creating new entry in UserBorrowProduct (new book)
        await UserBorrowProduct.create(UserBorrowProductData);

        let receiverUnlockCode = jsonSlotData.status.unlockCodes[0];

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
            if (lockerList[i].id === req.body.lockerId){
                locker = lockerList[i]
                break
            }
        }

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
        emailText = "L'oggetto " + product.title + " è stato prenotato. Recati al locker " + locker.nome +
            " sito in via " + locker.address + " e depositalo nello slot " +
            slot.index + ". Il codice per aprire lo slot è il seguente: " + receiverUnlockCode + "."
        const mailObjOwner = {
            from: process.env.MAIL_USER,
            to: product.user.email,
            subject: emailSubject,
            text: emailText
        }
        await sendMail(mailObjOwner);

        res.sendStatus(200);
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