const express = require('express');
const {User} = require("../database/models/user");
const router = express.Router();

router.get('/:id', function (req, res){
    const userId = req.params.id;
    User.findOne({
        where: {
            id: userId,
        },
        attributes: {
            exclude: ['password', 'token'],
        }
    }).then(user => res.json(user), (error) => {
        console.error(error);
        res.sendStatus(500);
    })
})
module.exports = router; //eof
