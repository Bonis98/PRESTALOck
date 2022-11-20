const express = require('express');
const {User} = require("../database/models/user");
const router = express.Router();

router.get('/:id', function (req, res){
    User.findOne({
        where: {
            id: req.params.id,
        },
        attributes: {
            exclude: ['password', 'token', 'createdAt', 'updatedAt'],
        }
    }).then(user => res.json(user), (error) => {
        console.error(error);
        res.sendStatus(500);
    })
})
module.exports = router; //eof
