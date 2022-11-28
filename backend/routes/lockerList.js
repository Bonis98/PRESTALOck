const fetch = require('node-fetch');
const express = require("express");
const {User} = require("../database/models/user");
const router = express.Router();


router.get('/', function (req, res){
    let lockerProvinceList = [];
    let currentUserProvince;

    //find user in DB to retrieve its province
    async function findInDb(){
        await User.findOne({
            where: {
                token: req.get('Auth-Token')
            }
        }).then(function (user){
            currentUserProvince = user.province
        }, (error) => {
            console.error(error);
            res.sendStatus(500);
        })
    }

    //filtering lockers list to send a new lockers list whose lockers are in the user's province
    function filterJSON (json){
        findInDb().then(() => {
            for (let i = 0; i<json.length; i++){
            if (currentUserProvince === json[i].provincia){
                lockerProvinceList.push(json[i]);
            }
        }
            res.json(lockerProvinceList);
        }, (error) => {
            console.error(error);
            res.sendStatus(500);
        })
    }

    //retrieving complete lockers list, parsing it and sending it for filtering
    fetch('http://hack-smartlocker.sintrasviluppo.it/api/lockers', {
        method: 'get',
        headers: {
            "x-apikey": process.env.API_KEY_LOCKERS,
            "x-tenant": process.env.TENANT
        }
    }).then(resp => resp.json(), (error) => {
            console.error(error);
            res.sendStatus(500);
        }
    ).then(json => filterJSON(json), (error) => {
        console.error(error);
        res.sendStatus(500);
    })
})


module.exports = router;