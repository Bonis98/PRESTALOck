const passport = require('passport');
const controller = require('../middleware/auth');
const express = require('express');
const path = require("path");
const {User} = require("../database/models/user");
const bcrypt = require("bcrypt");
const router = express.Router();


router.post('/', function (req, res){
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({
        where: {
            email:email
        }
    }).then((user) => {
        if (user) {
            bcrypt.compare(password, user.password).then((result) => {
                if (result){
                    //Send back token header for authentication
                    res.status(200).json({
                        token: user.token,
                        name: user.name,
                        surname: user.surname
                    });
                }
                else {
                    res.status(400).json({errortext: "Nome utente o password errati"});
                }
            }, (error) => {
                console.error(error);
                res.sendStatus(500);
            });
        }
        else {
            res.status(400).json({errortext: "Nome utente o password errati"});
        }
    }, (error) => {
        console.error(error);
        res.sendStatus(500);
    });
});

module.exports = router; //eof
