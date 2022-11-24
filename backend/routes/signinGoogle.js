const express = require("express");
const router = express.Router();
const {google} = require('googleapis');
const signupUtils = require("../signupUtils");
const {User} = require("../database/models/user");
const crypto = require("crypto");
const moment = require("moment");

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://localhost/api/signinGoogle/callback'
);

router.get('/', function (req, res){
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/user.birthday.read',
        'https://www.googleapis.com/auth/user.gender.read',
    ];
    const url = oauth2Client.generateAuthUrl({
        scope: scopes
    });
    res.redirect(url)
})

router.get('/callback', async function (req, res) {
    let userInfo = {}
    //Get a token from authcode
    try {
        const {tokens} = await oauth2Client.getToken(req.query.code)
        oauth2Client.setCredentials(tokens);
    }
    catch (error) {
        console.error(error)
        res.sendStatus(500)
        return
    }
    let oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
    });
    try{
        let info = await oauth2.userinfo.get()
        userInfo['email'] = info.data.email;
        userInfo['name'] = info.data.given_name;
        userInfo['surname'] = info.data.family_name;
    }
    catch (error) {
        console.error(error)
        res.sendStatus(500)
        return
    }
    try {
        const user = await User.findOne({
            where: {
                email: userInfo.email
            }
        })
        if (user){
            console.log('user already exists');
            let base64Data = Buffer.from(JSON.stringify({token: user.token})).toString("base64")
            res.redirect('/aftergooglelogin?data=' + base64Data)
            return;
        }
    }
    catch (error) {
        console.error(error)
        res.sendStatus(500)
        return;
    }
    oauth2 = google.people({
        auth: oauth2Client,
        version: 'v1'
    });
    let info = await oauth2.people.get({
        resourceName: 'people/me',
        personFields: 'genders,birthdays'
    })
    try {
        let DOB = info.data.birthdays[1].date.year + '-';
        DOB += info.data.birthdays[1].date.month.toString().padStart(2, '0') + '-';
        DOB += info.data.birthdays[1].date.day.toString().padStart(2, '0');
        userInfo['dateOfBirth'] = DOB
        const gender = info.data.genders[0].formattedValue.substring(0,1)
        switch (gender) {
            case 'Male':
                userInfo['gender'] = 'M'
                break
            case 'Female':
                userInfo['gender'] = 'F'
                break
            default:
                userInfo['gender'] = '*'
                break
        }
    }
    catch (error) {
        console.error(error)
        res.sendStatus(500)
        return
    }
    if (signupUtils.ageCalculation(userInfo.dateOfBirth, "YYYY-MM-DD")<18){
        console.log('user is a baby');
        res.status(400).json({errortext: "L'utente è minorenne"});
        return
    }
    if (!signupUtils.genderControl(userInfo.gender)){
        console.log('gender not valid');
        res.status(400).json({errortext: "Il gender non è valido"})
        return
    }
    try {
        //userInfo['token'] = crypto.randomBytes(20).toString('hex')
        //await User.create(userInfo)
        userInfo.dateOfBirth = moment(userInfo.dateOfBirth, 'YYYY-MM-DD').format('DD-MM-YYYY')
        let base64Data = Buffer.from(JSON.stringify(userInfo)).toString("base64")
        res.redirect('/aftergooglelogin?data=' + base64Data)
    }
    catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
})

module.exports = router;