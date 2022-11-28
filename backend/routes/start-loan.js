const express = require("express");
const {Product} = require ("../database/models/product");
const {UserBorrowProduct} = require("../database/models/userBorrowProduct");
const {User} = require("../database/models/user");
const fetch = require("node-fetch");
const moment = require("moment/moment");
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
        throw new Error("Found wrong number of occurences in UserBorrowProduct table")
    } return product;
}

router.get('/:idProduct', function(req, res){
    let receiverUnlockCode;
    User.findOne({
        where: {
            token: req.get('token')}
    }).then(
        function (currentUser){
            Product.findOne({
                where : {
                    id: req.params.idProduct,
                    idOwner: currentUser.id
                },
                attributes: ['id', 'maxLoanDays']
            }).then(
                async function (product){
                    let productVerified = await checkDuplicate(product)
                    let url = 'http://hack-smartlocker.sintrasviluppo.it/api/slots/' + req.params.idProduct.toString();
                    fetch(url, {
                        method: 'get',
                        headers: {
                            "x-apikey": process.env.API_KEY_LOCKERS,
                            "x-tenant": process.env.TENANT
                        }
                    }).then((resp) => {
                        resp.json().then((jsonData) => {
                            for (let key in jsonData){
                                receiverUnlockCode = jsonData[key].status.unlockCodes[1]
                            }
                        })
                    })
                    UserBorrowProduct.update({
                        startLoanDate: moment(new Date(), moment.ISO_8601)
                    },{
                        where:{
                            idProduct: productVerified.id
                        }
                    }).then((result = result.filter(Boolean)) =>{
                        User.findOne({
                            where: {
                                id: result[1].idUser
                            }
                        }).then((receiver)=>{
                            let emailSubject = "L'oggetto prenotato è pronto per il ritiro"
                            let returningDate = moment().add(productVerified.maxLoanDays, 'days').calendar()
                            let emailText = currentUser.name + " " + currentUser.surname + " ha depositato l'oggetto " +
                                productVerified.title + " nello slot " + result[1].lockerSlot +
                                ". Il codice per aprire lo sportello e accedere al ritiro è il seguente: " +
                                receiverUnlockCode + ". Ti ricordiamo che il prodotto dovrà essere restituito entro " +
                                returningDate + "."
                            let mailObjReceiver = {
                                from: process.env.EMAIL_SERVICE_HOST,
                                to: receiver.email,
                                subject: emailSubject,
                                text: emailText
                            }
                            sendMail(mailObjReceiver)
                        }).then(() => {
                            let emailSubject = "Conferma inizio prestito"
                            let emailText = "Hai depositato il tuo oggetto con successo. " +
                                "Da oggi inizia ufficialmente il periodo di prestito."
                            let mailObjOwner = {
                                from: process.env.EMAIL_SERVICE_HOST,
                                to: currentUser.email,
                                subject: emailSubject,
                                text: emailText
                            }
                            sendMail(mailObjOwner).then(() =>
                                res.sendStatus(200)
                            )
                        })
                    })

                })
        }
    ).catch(error =>{
        console.error(error);
        res.sendStatus(500);
    })
})

module.exports = router;