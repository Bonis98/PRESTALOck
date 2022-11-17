const passport = require('passport');
const moment = require('moment');
const controller = require('../middleware/controller');
const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const {User} = require("../database/models/user");
const router = express.Router();


//router.all('*', controller.is_guest); //it will work when passport would have been set


router.get('/', function (req, res){
    res.sendFile('signup.html', { root: path.join(__dirname, '../public') })
});


router.post('/', function (req, res, next){
        const generate_hash = function (password) {
            return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        };
        const ageCalculation = function (dateOfBirth){
            const dob = moment(dateOfBirth, "DD-MM-YYYY").toDate();
            const diff_ms = Date.now() - dob.getTime();
            const age_dt = new Date(diff_ms);
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
                console.error('user already exists');
                res.status(400).send("L'utente esiste già");
            }else if (ageCalculation(req.body.dateOfBirth)<18) {
                console.error('user is a baby');
                res.status(400).send("L'utente è minorenne");
            }else if (!genderControl(req.body.gender)){
                console.error('gender not valid');
                res.status(400).send("Il gender non è valido")
            }else{
                console.log('user does not exists and age is over 18');
                const user_password = generate_hash(req.body.password);

                const data = {
                    email: req.body.email,
                    password: user_password,
                    name: req.body.name,
                    surname: req.body.surname,
                    dateOfBirth: moment(req.body.dateOfBirth, "DD-MM-YYYY").toDate().toISOString(),
                    gender: req.body.gender,
                    province: req.body.province
                };
                User.create(data).then(() => {
                    res.sendStatus(200);
                },(error) => {
                    console.error(error)
                    res.sendStatus(500);
                })
            }
        })
})

module.exports = router; //eof
