const passport = require('passport');
const moment = require('moment');
const controller = require('../middleware/controller');
const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const {User} = require("../database/models/user");
const router = express.Router();


//router.all('*', controller.is_guest); //it will work when passport would have been set


router.get('/', function (req, res){
    res.sendFile('signup.html', { root: path.join(__dirname, '../public') })
});


router.post('/', function (req, res, next){
    //Calculate age of the user
    const ageCalculation = function (dateOfBirth){
        //Convert date to js Date
        const dob = moment(dateOfBirth, "DD-MM-YYYY").toDate();
        //Calculate difference from current date
        const diff_ms = Date.now() - dob.getTime();
        //Create date from millis
        const age_dt = new Date(diff_ms);
        //Return difference
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    const genderControl = function (gender){
        return gender === 'M' || gender === 'F' || gender === '*';
    }

    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(function(user) {
        if (user) {
            console.log('user already exists');
            res.status(400).json({errortext: "L'utente esiste già"});
        }else if (ageCalculation(req.body.dateOfBirth)<18) {
            console.log('user is a baby');
            res.status(400).json({errortext: "L'utente è minorenne"});
        }else if (!genderControl(req.body.gender)){
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
