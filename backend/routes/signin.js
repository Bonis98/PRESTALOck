const passport = require('passport');
const controller = require('../middleware/controller');
const express = require('express');
const path = require("path");
const router = express.Router();


//router.all('*', controller.is_guest); //it will work when passport would have been set


router.get('/', function (req, res){
    res.sendFile('signin.html', { root: path.join(__dirname, '../public') })
})

router.post('/', function (req, res){
    res.send('To implement')
})

module.exports = router; //eof