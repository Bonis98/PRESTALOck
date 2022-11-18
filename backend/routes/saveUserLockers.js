const express = require('express');
const {User} = require("../database/models/user");
const router = express.Router();


router.post('/', function (req, res, next){
    let lockerList = req.body.lockers;

    lockerList = lockerList.toString();
    //Locker list is stored as a semicolon separated integers
    lockerList = lockerList.replaceAll(',', ';');
    lockerList += ';';
    User.update({lockerList: lockerList}, {
        where: {
            token: req.get('token')
        }
    }).then(() => res.sendStatus(200), (error) => {
        console.error(error);
        res.sendStatus(500);
    })
});

module.exports = router; //eof
