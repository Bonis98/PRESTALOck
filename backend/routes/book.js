const express = require("express");
const {Product} = require ("../database/models/product");
const fetch = require("node-fetch");
const {UserBorrowProduct} = require("../database/models/userBorrowProduct");
const {User} = require("../database/models/user");
const sendMail = require("../utils/mailUtils");
const {sequelize} = require("../database/connection");
const {Op} = require("sequelize");
const router = express.Router();

class NoSlotError extends Error {
    constructor(args){
        super(args);
        this.name = "NoSlotError";
    }
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

function checkSlotAvailability(slot){
    if (!slot) {
        throw new NoSlotError("No available slots found.");
    }
}

//find current user in DB
async function findCurrentUserInDB(req) {
    return await User.findOne({
        where: {
            token: req.get('Auth-Token')
        },
        attributes: ['id', 'name', 'surname', 'email']
    });
}

router.post('/', async function (req, res) {
    let UserBorrowProductData;
    let bodyPostBook;

    //check product has no other active book
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

    const t = await sequelize.transaction();
    let bookedSlotId = 0;
    try {

        //find the product requested for book
        const product = await Product.findOne({
            where: {
                id: req.body.idProduct,
                availability: true
            },
            attributes: ['id', 'idOwner', 'title'],
            include: [{
                model: User,
                required: true,
                attributes: ['email']
            }]
        });

        //if the product does not exist, send status 404 and return
        if (!product){
            res.sendStatus(404); // Not Found
            return;
        }

        await checkNoActiveBook(product);

        const userReceiver = await findCurrentUserInDB(req);

        //the receiver cannot be the owner of the requested product
        if (userReceiver.id === product.idOwner){
            res.status(400).json({errorTex: "Errore: Il ricevente non corrispondere al proprietario " +
                    "del prodotto richiesto"}); // Client error
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
        await checkSlotAvailability(slot);

        bodyPostBook = {
            customerId: userReceiver.id,
            customerName: userReceiver.name + " " + userReceiver.surname,
            slotId: slot.id,
            slotContent: product.title
        };

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

        bookedSlotId = slot.id;

        if (respPost.status !== 200) {
            res.status(503).json({errorText: "Errore temporaneo, riprova"}); // Service unavailable
            return;
        }
        const jsonSlotData = await respPost.json();


        await Product.update({
            availability: false
        }, {
            where: {
                id: product.id
            },
            transaction: t
        });

        UserBorrowProductData = {
            idUser: userReceiver.id,
            idProduct: product.id,
            lockerId: req.body.lockerId,
            lockerSlot: bookedSlotId
        };

        //creating new entry in UserBorrowProduct (new book)
        await UserBorrowProduct.create(UserBorrowProductData, {transaction: t});

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
            if (lockerList[i].id == req.body.lockerId){
                locker = lockerList[i];
                break
            }
        }

        //setting email for receiver
        let emailSubject = "Prenotazione confermata";
        let emailText = `Il proprietario dell'oggetto è stato notificato della richiesta di prestito. ` +
        `Ti verrà inviata una seconda mail quando l'oggetto sarà pronto per il ritiro.`;
        const mailObjReceiver = {
            from: process.env.MAIL_USER,
            to: userReceiver.email,
            subject: emailSubject,
            text: emailText
        };
        await sendMail(mailObjReceiver);

        //setting email for owner
        emailSubject = "Richiesta di prestito";
        emailText = `L'oggetto ${product.title} è stato prenotato. Recati al locker ${locker.nome} sito in 
        via ${locker.address} e depositalo nello slot ${slot.index}. 
        Il codice per aprire lo slot è il seguente: ${receiverUnlockCode}.`;
        const mailObjOwner = {
            from: process.env.MAIL_USER,
            to: product.user.email,
            subject: emailSubject,
            text: emailText
        };
        await sendMail(mailObjOwner);

        await t.commit();
        res.sendStatus(200);
    } catch (e) {
        await t.rollback();
        //If error, release booked slot
        if (bookedSlotId){
            release(bookedSlotId)
        }
        if (e instanceof NoSlotError) {
            console.error(e.message);
            res.sendStatus(409); // Conflict
        } else {
            console.log(e);
            res.sendStatus(500);
        }
    }
});

router.get('/return/:idProduct', async function(req, res){

    const t = await sequelize.transaction();
    let bookedSlotId = 0;
    try {
        const currentUser = await findCurrentUserInDB(req);

        const activeBook = await UserBorrowProduct.findOne({
            where: {
                idUser: currentUser.id,
                idProduct: req.params.idProduct,
                loanStartDate: {
                    [Op.not]: null
                },
                terminationDate: null
            }, include: [{
                model: Product,
                required: true,
                attributes: ['title'],
                include: [{
                    model: User,
                    required: true,
                    attributes: ['email']
                }]
            }], attributes: {
                exclude: ['requestDate', 'createdAt', 'updatedAt']
            }
        });

        if(!activeBook){
            res.sendStatus(404); //not found
            return;
        }

        //retrieving complete lockers list
        let lockerList = await fetch('http://hack-smartlocker.sintrasviluppo.it/api/lockers', {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        });

        const urlSlotsByLocker = 'http://hack-smartlocker.sintrasviluppo.it/api/slots?lockerId=' + activeBook.lockerId;
        //retrieve all slots for locker already used
        let slots = await fetch(urlSlotsByLocker, {
            method: 'get',
            headers: {
                "x-apikey": process.env.API_KEY_LOCKERS,
                "x-tenant": process.env.TENANT
            }
        });
        slots = await slots.json();

        let slot = await searchSlot(slots);
        await checkSlotAvailability(slot);

        const bodyPostBook = {
            customerId: currentUser.id,
            customerName: currentUser.name + " " + currentUser.surname,
            slotId: slot.id,
            slotContent: activeBook.product.title
        };

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

        if (respPost.status !== 200) {
            res.status(503).json({errorText: "Errore temporaneo, riprova"}); // Service unavailable
            return;
        }
        bookedSlotId = slot.id;
        const jsonSlotData = await respPost.json();

        await activeBook.update({returnLockerSlot: bookedSlotId}, {transaction: t});
        await activeBook.save({transaction: t});

        lockerList = await lockerList.json();
        //retrieve locker data -> send its name and address through email
        let locker;
        for (let i=0; i<lockerList.length; i++){
            if (lockerList[i].id === activeBook.lockerId){
                locker = lockerList[i];
                break
            }
        }

        let receiverUnlockCode = jsonSlotData.status.unlockCodes[0];

        //setting email for borrower
        let emailSubject = "Prenotazione slot locker confermata";
        let emailText = `Hai prenotato con successo lo slot ${slot.index} del locker ${locker.nome} sito in via ` +
         `${locker.address}. Il proprietario di ${activeBook.product.title} è stato notificato ` +
         `dell'avvio della procedura di restituzione. ` +
         `Il codice di sblocco che dovrai usare è il seguente: ${receiverUnlockCode}`;
        const mailObjBorrower = {
            from: process.env.MAIL_USER,
            to: currentUser.email,
            subject: emailSubject,
            text: emailText
        };
        await sendMail(mailObjBorrower);

        //setting email for owner
        emailSubject = "Notifica avvio restituzione";
        emailText = `L'oggetto ${activeBook.product.title} ha iniziato l'iter di restituzione. Ti manderemo un'email` +
        ` quando sarà stato depositato.`;
        const mailObjOwner = {
            from: process.env.MAIL_USER,
            to: activeBook.product.user.email,
            subject: emailSubject,
            text: emailText
        };
        await sendMail(mailObjOwner);

        await t.commit();
        res.sendStatus(200);

    } catch (error) {
        await t.rollback();
        //If error, release booked slot
        if (bookedSlotId){
            release(bookedSlotId)
        }
        // release
        if (error instanceof NoSlotError) {
            console.error(error.message);
            res.sendStatus(409); // Conflict
        } else {
            console.log(error);
            res.sendStatus(500);
        }
    }

});

function release (slotID) {
    //Release the slot on Sintra API
    fetch('http://hack-smartlocker.sintrasviluppo.it/api/release?slotId=' + slotID, {
        method: 'post',
        headers: {
            "x-apikey": process.env.API_KEY_LOCKERS,
            "x-tenant": process.env.TENANT,
        }
    }).catch((error) => {
        console.error(error)
    });
}

module.exports = router;
