const express = require('express');
const crypto = require('crypto');
const {User} = require("../database/models/user");
const sendMail = require("../utils/mailUtils");
const signupUtils = require("../utils/signupUtils");
const router = express.Router();


router.post('/', function (req, res){
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(function(user) {
        if (user) {
            console.log('user already exists');
            res.status(400).json({errorText: "L'utente esiste già"});
        }else if (signupUtils.ageCalculation(req.body.dateOfBirth, "YYYY-MM-DD")<18) {
            console.log('user is a baby');
            res.status(400).json({errorText: "L'utente è minorenne"});
        }else if (!signupUtils.genderControl(req.body.gender)){
            console.log('gender not valid');
            res.status(400).json({errorText: "Il gender non è valido"})
        }else{
            //All checks are passed, insert user in DB
            console.log('user does not exists and age is over 18');
            let userData = {
                email: req.body.email,
                name: req.body.name,
                surname: req.body.surname,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                province: req.body.province,
                token: crypto.randomBytes(20).toString('hex'),
            };
            //Hashing is done by sequelize
            if (req.body.password){
                userData.password = req.body.password
            }
            User.create(userData).then((userData) => {
                let vocal;
                switch (userData.gender) {
                    case "M":
                        vocal = "o";
                        break;
                    case "F":
                        vocal = "a";
                        break;
                    default:
                        vocal = "*";
                }
                const emailSubject = "Registrazione avvenuta con successo!"
                const emailText = `Benvenut${vocal} ${userData.name} ${userData.username}! La ringraziamo per essersi `+
                    `registrat${vocal} sulla nostra piattaforma. Speriamo che il contenuto e le funzionalità `+
                    `possano essere di suo gradimento. In caso contrario non esiti a contattarci.
                    Buona permanenza! `+
                    `Distinti saluti, 
                    Assistenza clienti PRESTALOck`;
                const mailObj = {
                    from: process.env.MAIL_USER,
                    to: userData.email,
                    subject: emailSubject,
                    text: emailText
                };
                sendMail(mailObj).catch((error) => console.log(error))

                res.status(200).json({
                    token: userData.token,
                    userId: userData.id,
                    name: userData.name,
                    surname: userData.surname
                });
            },(error) => {
                console.error(error);
                res.sendStatus(500);
            });
        }
    });
});

module.exports = router; //eof
