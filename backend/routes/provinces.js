const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get('/', function (req, res) {
    let provinces = [];
    try {
        const data = fs.readFileSync('./provinces.txt', 'binary');
        provinces = data.split(/\r?\n/);
        const provinceList = {provinces}
        res.json(provinceList);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

module.exports = router;