const moment = require('moment');
const express = require('express');
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const {User} = require("../database/models/user");
const signupUtils = require("../signupUtils");
const router = express.Router();


router.post('/', function (req, res, next){
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(function(user) {
        if (user) {
            console.log('user already exists');
            res.status(400).json({errortext: "L'utente esiste già"});
        }else if (signupUtils.ageCalculation(req.body.dateOfBirth, "DD-MM-YYYY")<18) {
            console.log('user is a baby');
            res.status(400).json({errortext: "L'utente è minorenne"});
        }else if (!signupUtils.genderControl(req.body.gender)){
            console.log('gender not valid');
            res.status(400).json({errortext: "Il gender non è valido"})
        }else{
            //All checks are passed, insert user in DB
            console.log('user does not exists and age is over 18');
            let userData = {
                email: req.body.email,
                name: req.body.name,
                surname: req.body.surname,
                dateOfBirth: moment(req.body.dateOfBirth, "DD-MM-YYYY").toDate().toISOString(),
                gender: req.body.gender,
                province: req.body.province,
                token: crypto.randomBytes(20).toString('hex'),
            };
            //Calculate hash of the password
            bcrypt.hash(req.body.password, bcrypt.genSaltSync(10)).then((hash) => {
                userData.password = hash
                User.create(userData).then(() => {
                    res.status(200).json({token: userData.token});
                },(error) => {
                    console.error(error)
                    res.sendStatus(500);
                });
            }, (error) => {
                console.error(error);
                res.sendStatus(500);
            })
        }
    });
});

module.exports = router; //eof
