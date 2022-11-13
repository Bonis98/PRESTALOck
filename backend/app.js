const fs = require('fs');
const express = require('express');
const https = require('https')
const http = require('http')

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const passport = require('passport');

const signup = require('./routes/signup');

const app = express();
const port = 443;


app.use(bodyParser.json());
app.use(cookieParser());

//routes
app.use('/signup', signup);
app.use('/static', express.static('public'));

//simply check server is ok before constructing home route
app.get('/', (req, res) => {
    res.send("IT'S WORKING!")
})

const httpsOptions = {
    key: fs.readFileSync('./certificates/server.key'),
    cert: fs.readFileSync('./certificates/server.cert')
}

const server = https.createServer(httpsOptions, app)
    .listen(port, () => {
        console.log('server running at ' + port)
    })

http.createServer(function (req, res) {
    res.writeHead(307, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);