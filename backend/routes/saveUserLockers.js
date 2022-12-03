const express = require('express');
const {User} = require("../database/models/user");
const router = express.Router();


router.post('/', function (req, res){
    let lockerList;

    if (!req.body.lockers) {
        res.sendStatus(400); // Bad request
    } else {
        lockerList = req.body.lockers;
        if (!lockerList.length) {
            res.sendStatus(422); // Unprocessable Entity
        } else {
            lockerList = lockerList.toString();
            //Locker list is stored as a semicolon separated integers
            lockerList = lockerList.replaceAll(',', ';');
            lockerList += ';';
            User.update({lockerList: lockerList}, {
                where: {
                    token: req.get('Auth-Token')
                }
            }).then(() => res.sendStatus(200), (error) => {
                console.error(error);
                res.sendStatus(500);
            })
        }
    }
});

module.exports = router; //eof
