const express = require('express');
const router = express.Router();


router.all('*', express.static('../public'))
//insert code here


module.exports = router; //eof