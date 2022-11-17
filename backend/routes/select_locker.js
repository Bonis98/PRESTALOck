const express = require("express");
//const fetch = require("node-fetch");
const path = require("path");
const router = express.Router();

router.get('/', function (req, res){
    res.sendFile('select_locker.html', { root: path.join(__dirname, '../public') })
})
router.post('/', function (req, res){

})

module.exports = router;