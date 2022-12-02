const express = require('express');
const {User} = require("../database/models/user");
const crypto = require("crypto")
const {sequelize} = require("../database/connection");
const sendMail = require("../utils/mailUtils");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get('/:email',async function (req, res){
    const randomCode = crypto.randomBytes(12).toString('hex')
    const t = await sequelize.transaction()
    try{
        const user = await User.findOne({
            where: {
                email: req.params.email.toLowerCase(),
            }
        })
        if (!user){
            res.sendStatus(401)
        }
        else {
            await User.update({
                token: 'PASSWORD_RESET',
                password: randomCode
            }, {
                where: {
                    email: req.params.email,
                },
            }, {
                transaction: t
            })
            const mailObjReceiver = {
                from: process.env.MAIL_USER,
                to: req.params.email,
                subject: 'Reset password',
                text: 'Hai richiesto il reset della tua password, utilizza il codice ' + randomCode +
                    ' per procedere al reset'
            }
            await sendMail(mailObjReceiver)
            await t.commit()
            res.sendStatus(200)
        }
    } catch (error) {
        console.error(error)
        await t.rollback()
        res.sendStatus(500)
    }
})

router.post('/', async function (req, res){
    try {
        let user = await User.findOne({
            where: {
                email: req.body.email.toLowerCase(),
            },
            attributes: [['id', 'userId'], 'name', 'surname', 'password']
        })
        if (!user){
            res.sendStatus(401)
        } else {
            const result = await bcrypt.compare(req.body.tempCode, user.password)
            if (!result){
                res.sendStatus(401)
            } else {
                const token = crypto.randomBytes(20).toString('hex')
                await User.update({
                    token: token,
                    //Hashing is done by Sequelize
                    password: req.body.newPassword,
                }, {
                    where: {
                        email: req.body.email
                    }
                })
                user.dataValues.token = token
                delete user.dataValues.password
                res.json(user)
            }
        }
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

module.exports = router; //eof
