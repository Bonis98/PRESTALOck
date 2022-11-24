const express = require('express');
const {User} = require("../database/models/user");
const bcrypt = require("bcrypt");
const {Op} = require("sequelize");
const router = express.Router();


router.post('/', async function (req, res) {
        let email = req.body.email;
        let password = req.body.password;
        try {
            const user = await User.findOne({
                where: {
                    email: email,
                    //If password is null, user registered with Oauth2
                    password: {
                        [Op.ne]: null
                    },
                }
            });
            if (user) {
                const result = await bcrypt.compare(password, user.password)
                if (result) {
                    //Send back token header for authentication
                    res.status(200).json({
                        token: user.token,
                        name: user.name,
                        surname: user.surname
                    });
                } else {
                    res.status(400).json({errortext: "Indirizzo email o password errati"});
                }
            } else {
                res.status(400).json({errortext: "Indirizzo email o password errati"});
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    }
);

module.exports = router; //eof
