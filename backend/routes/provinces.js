const express = require("express");
const fs = require("fs");
const router = express.Router();

router.get('/', function (req, res) {
    let provinceList = [];
    try {
        const data = fs.readFileSync('./provinces.txt', 'binary');
        provinceList = data.split(/\r?\n/);
        provinceList.pop();
        res.json(provinceList);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

module.exports = router;