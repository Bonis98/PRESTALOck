const express = require("express");
const router = express.Router();
const {google} = require('googleapis');
const {User} = require("../database/models/user");
const crypto = require('crypto');

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
    const state = crypto.randomBytes(30).toString('hex');
    const url = oauth2Client.generateAuthUrl({
        scope: scopes,
        state: state
    });
    res.cookie('state', state, {signed: true});
    res.redirect(url)
});

router.get('/callback', async function (req, res) {
    res.clearCookie('state');
    //Check state parameter
    if (req.signedCookies.state != req.query.state){
        res.sendStatus(401);
        return
    }
    let userInfo = {};
    //Get a token from auth code
    try {
        const {tokens} = await oauth2Client.getToken(req.query.code);
        oauth2Client.setCredentials(tokens);
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
        return
    }
    let oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
    });
    try{
        let info = await oauth2.userinfo.get();
        userInfo['email'] = info.data.email;
        userInfo['name'] = info.data.given_name;
        userInfo['surname'] = info.data.family_name;
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
        return
    }
    try {
        const user = await User.findOne({
            where: {
                email: userInfo.email
            },
            attributes: [['id', 'userId'],'name', 'surname', 'token']
        });
        if (user){
            console.log('user already exists');
            let base64Data = Buffer.from(JSON.stringify(user.dataValues)).toString("base64");
            res.redirect('/afterOAuthLogin?data=' + base64Data);
            return;
        }
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
    oauth2 = google.people({
        auth: oauth2Client,
        version: 'v1'
    });
    let info = await oauth2.people.get({
        resourceName: 'people/me',
        personFields: 'genders,birthdays'
    });
    try {
        if (info.data.birthdays && info.data.birthdays[1]) {
            let DOB = info.data.birthdays[1].date.year + '-';
            DOB += info.data.birthdays[1].date.month.toString().padStart(2, '0') + '-';
            DOB += info.data.birthdays[1].date.day.toString().padStart(2, '0');
            userInfo['dateOfBirth'] = DOB
        }
        const gender = info.data.genders[0].formattedValue.substring(0,1);
        switch (gender) {
            case 'male':
                userInfo['gender'] = 'M';
                break;
            case 'female':
                userInfo['gender'] = 'F';
                break;
            default:
                userInfo['gender'] = '*';
                break
        }
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500);
        return
    }
    try {
        let base64Data = Buffer.from(JSON.stringify({ userData: userInfo })).toString("base64");
        res.redirect('/afterOAuthLogin?data=' + base64Data)
    }
    catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
});

module.exports = router;