const passport = require('passport');
const controller = require('../middleware/controller');
const express = require('express');
const path = require("path");
const {User} = require("../database/models/user");
const bcrypt = require("bcrypt");
const router = express.Router();


//router.all('*', controller.is_guest); //it will work when passport would have been set


router.get('/', function (req, res){
    res.sendFile('signin.html', { root: path.join(__dirname, '../public') })
})

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
                    //Set token header for authentication
                    res.status(200).json({token: user.token});
                }
                else {
                    res.status(400).send("Nome utente o password errati");
                }
            }, (error) => {
                console.error(error);
                res.sendStatus(500);
            });
        }
        else {
            res.status(400).send("Nome utente o password errati");
        }
    }, (error) => {
        console.error(error);
        res.sendStatus(500);
    });
});

module.exports = router; //eof
