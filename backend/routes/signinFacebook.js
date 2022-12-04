const express = require("express");
const router = express.Router();
const {User} = require("../database/models/user");
const moment = require("moment");
const crypto = require("crypto");
const fetch = require("node-fetch");

router.get('/', function (req, res){
    const state = crypto.randomBytes(30).toString('hex');
    res.cookie('state', state, {signed: true});
    res.redirect('https://www.facebook.com/v15.0/dialog/oauth?' + new URLSearchParams({
        client_id: process.env.FACEBOOK_CLIENT_ID,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
        state: state,
        scope: 'email,user_birthday,user_gender'
    }))
});

router.get('/callback', async function (req, res) {
    res.clearCookie('state');
    //Check state parameter
    if (req.signedCookies.state != req.query.state){
        res.sendStatus(401);
        return
    }
    try {
        //Get access token from auth code
        let response = await fetch('https://graph.facebook.com/v15.0/oauth/access_token?' + new URLSearchParams({
            client_id: process.env.FACEBOOK_CLIENT_ID,
            redirect_uri: 'https://localhost/api/signinFacebook/callback',
            client_secret: process.env.FACEBOOK_CLIENT_SECRET,
            code: req.query.code,
        }));
        let body = await response.json();
        let access_token = body.access_token;
        //Get user id
        response = await fetch('https://graph.facebook.com/me?' + new URLSearchParams({
            access_token: access_token
        }));
        body = await response.json();
        //Get user data
        response = await fetch('https://graph.facebook.com/' + body.id + '?' + new URLSearchParams({
            fields: 'first_name,last_name,email,birthday,gender',
            access_token: access_token
        }));
        body = await response.json();
        let userInfo = {};
        userInfo['email'] = body.email;
        userInfo['name'] = body.first_name;
        userInfo['surname'] = body.last_name;
        userInfo['dateOfBirth'] = moment(body.birthday, 'MM/DD/YYYY').format('YYYY-MM-DD');
        switch (body.gender) {
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
        //Check if user already exists
        const user = await User.findOne({
            where: {
                email: userInfo.email
            },
            attributes: [['id', 'userId'], 'name', 'surname', 'token']
        });
        //If already exists, send back token
        if (user){
            console.log('user already exists');
            let base64Data = Buffer.from(JSON.stringify(user.dataValues)).toString("base64");
            res.redirect('/afterOAuthLogin?data=' + base64Data);
            return;
        }
        let base64Data = Buffer.from(JSON.stringify({userData: userInfo})).toString("base64");
        res.redirect('/afterOAuthLogin?data=' + base64Data)
    } catch (error) {
        console.error(error);
        res.sendStatus(500)
    }
});

module.exports = router;