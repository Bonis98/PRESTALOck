const express = require("express");
const {Product} = require ("../database/models/product");
const {UserBorrowProduct} = require("../database/models/userBorrowProduct");
const {User} = require("../database/models/user");
const fetch = require("node-fetch");
const moment = require("moment");
const sendMail = require("../utils/mailUtils");
const {Op} = require("sequelize");
const {sequelize} = require("../database/connection");
const router = express.Router();

async function checkDuplicate(product){
    const numberOfOccurrences = await UserBorrowProduct.count({
        where:{
            idProduct: product.id,
            loanStartDate: null,
            terminationDate: null
        }
    });
    if (numberOfOccurrences != 1){
        throw new Error("Found wrong number of occurrences in UserBorrowProduct table")
    }
}

async function findCurrentUserInDB(req) {
    return await User.findOne({
        where: {
            token: req.get('Auth-Token')
        },
        attributes: ['id', 'name', 'surname', 'email']
    });
}

router.get('/start/:idProduct', async function (req, res) {
    let receiverUnlockCode;
    let slotIndex;
    const t = await sequelize.transaction();
    try {
        const currentUser = await findCurrentUserInDB(req);
        const product = await Product.findOne({
            where: {
                id: req.params.idProduct,
            },
            attributes: ['id', 'maxLoanDays', 'title']
        });
        if (!product) {
            res.sendStatus(404);
            return
        } else if (product.idOwner != currentUser.id){
            res.status(403).json({errorText: 'Non sei il proprietario del prodotto'}); //Conflict
            return;
        }
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
        });
        if (!borrower) {
            res.status(409).json({errorText: 'Il prestito non è stato prenotato'}); //Conflict
            return;
        }
        await checkDuplicate(product);
        let url = 'http://hack-smartlocker.sintrasviluppo.it/api/slots/' + borrower.lockerSlot;
        const resp = await fetch(url, {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        });
        const jsonData = await resp.json();
        receiverUnlockCode = jsonData.status.unlockCodes[1];
        let lockerId = jsonData.lockerId;
        slotIndex = jsonData.index;

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
                locker = lockerList[i];
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
            transaction: t
        });
        let emailSubject = "L'oggetto prenotato è pronto per il ritiro";
        let returningDate = moment().add(10, 'days').locale('it').calendar({
            sameDay: '[Oggi]',
            nextDay: '[Domani]',
            nextWeek: 'dddd',
        });
        let emailText = currentUser.name + " " + currentUser.surname + " ha depositato l'oggetto " +
            product.title + " nello slot " + slotIndex + " del locker " + locker.nome + " in " + locker.address +
            ". Il codice per aprire lo sportello e accedere al ritiro è il seguente: " +
            receiverUnlockCode + ". Ti ricordiamo che il prodotto dovrà essere restituito entro " +
            returningDate + ".";
        let mailObjReceiver = {
            from: process.env.MAIL_USER,
            to: borrower.user.email,
            subject: emailSubject,
            text: emailText
        };
        await sendMail(mailObjReceiver);
        emailSubject = "Conferma inizio prestito";
        emailText = "Hai depositato il tuo oggetto con successo. " +
            "Da oggi inizia ufficialmente il periodo di prestito.";
        let mailObjOwner = {
            from: process.env.MAIL_USER,
            to: currentUser.email,
            subject: emailSubject,
            text: emailText
        };
        await sendMail(mailObjOwner);

        const urlRelease = `http://hack-smartlocker.sintrasviluppo.it/api/release?slotId=${borrower.lockerSlot}`;

        //release slot
        let release = await fetch(urlRelease, {
            method: 'post',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        });
        if (release.status !== 200) {
            res.status(503).json({errorText: "Errore temporaneo, riprova"}); // Service unavailable
            return;
        }

        await t.commit();
        res.sendStatus(200)
    } catch (error) {
        console.error(error);
        await t.rollback();
        res.sendStatus(500)
    }
});

router.get('/close/:idProduct', async function(req, res){
    const t = await sequelize.transaction();
    //TODO: Use transactions
    try {
        const currentUser = await findCurrentUserInDB(req);
        const activeBook = await UserBorrowProduct.findOne({
            where: {
                idUser: currentUser.id,
                idProduct: req.params.idProduct,
                loanStartDate: {
                    [Op.not]: null
                },
                terminationDate: null,
                returnLockerSlot: {
                    [Op.not]: null
                }
            },
            include: [{
                model: Product,
                required: true,
                attributes: ['idOwner', 'title'],
                include: [{
                    model: User,
                    required: true,
                    attributes: ['email']
                }]
            }]
        });
        if(!activeBook){
            res.sendStatus(404); //not found
            return;
        }
        if(currentUser.id === activeBook.product.idOwner){
            res.status(400).json({errorTex: "Errore: Il ricevente non corrispondere al proprietario " +
                    "del prodotto richiesto"}); // Client error
            return;
        }

        await activeBook.update({terminationDate: moment(new Date(), moment.ISO_8601)}, {transaction: t})
        await activeBook.save({transaction: t})

        const urlInfoSlot = `http://hack-smartlocker.sintrasviluppo.it/api/slots/${activeBook.returnLockerSlot}`;
        //retrieve slot info by its id
        let infoSlot = await fetch(urlInfoSlot, {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        });
        const jsonInfoSlot = await infoSlot.json();
        let ownerUnlockCode = jsonInfoSlot.status.unlockCodes[1];


        //retrieving complete lockers list (only email purpose)
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
            if (lockerList[i].id === infoSlot.lockerId){
                locker = lockerList[i];
                break
            }
        }

        //setting email for borrower
        let emailSubject = "Termine prestito confermato";
        let emailText = `Hai depositato con successo il prodotto ${activeBook.product.title} nello slot ${infoSlot.index} 
        del locker ${locker.nome} sito in via ${locker.address}. Il proprietario del prodotto è stato notificato 
        del termine del prestito conseguente all'avvenuto deposito.`;
        const mailObjBorrower = {
            from: process.env.MAIL_USER,
            to: currentUser.email,
            subject: emailSubject,
            text: emailText
        };
        await sendMail(mailObjBorrower);

        //setting email for owner
        emailSubject = "Notifica termine prestito";
        emailText = `L'oggetto ${activeBook.product.title} è stato depositato ed è pronto per il ritiro nello 
        slot ${infoSlot.index} del locker ${locker.nome} sito in via ${locker.address}. 
        Il codice per il ritiro è il seguente: ${ownerUnlockCode}`;
        const mailObjOwner = {
            from: process.env.MAIL_USER,
            to: activeBook.product.user.email,
            subject: emailSubject,
            text: emailText
        };
        await sendMail(mailObjOwner);

        const urlRelease = `http://hack-smartlocker.sintrasviluppo.it/api/release?slotId=${activeBook.returnLockerSlot}`;

        //release slot
        let resp = await fetch(urlRelease, {
            method: 'post',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        });
        if (resp.status !== 200) {
            res.status(503).json({errorText: "Errore temporaneo, riprova"}); // Service unavailable
            return;
        }

        await t.commit();
        res.sendStatus(200);
    //TODO: finish route
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.sendStatus(500)
    }
});

module.exports = router;
