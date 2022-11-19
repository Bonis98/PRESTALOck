const fetch = require('node-fetch');
const express = require("express");
const {User} = require("../database/models/user");
const router = express.Router();


router.get('/', function (req, res){
    let lockerProvinceList = [];
    let currentUserProvince;

    async function findInDb(){
        await User.findOne({
            where: {
                token: req.get('token')
            }
        }).then(function (user){
            currentUserProvince = user.province
        })
    }

    function filterJSON (json){
        findInDb().then(() => {
            for (let i = 0; i<json.length; i++){
            if (currentUserProvince === json[i].provincia){
                lockerProvinceList.push(json[i]);
            }
        }
        })
    }
    fetch('http://hack-smartlocker.sintrasviluppo.it/api/lockers', {
        method: 'get',
        headers: {
            "x-apikey": process.env.API_KEY_LOCKERS,
            "x-tenant": process.env.TENANT
        }
    }).then(resp => resp.json()
    ).then(json => filterJSON(json))

    res.json(lockerProvinceList);
})
router.post('/', function (req, res){

})

module.exports = router;