const fs = require('fs');
const express = require('express');
const session = require('express-session');
const https = require('https');
const http = require('http');
const helmet = require("helmet");

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const passport = require('passport');

const signup = require('./routes/signup');
const signin = require('./routes/signin');
const selectLocker = require('./routes/select_locker');
const saveUserLockers = require("./routes/saveUserLockers");
const user = require('./routes/user');
const product = require('./routes/product');
const {User} = require("./database/models/user");
const {Product} = require("./database/models/product");
const {UserBorrowProduct} = require("./database/models/userBorrowProduct");

const app = express();
const port = 443;

app.use(helmet());
app.use(bodyParser.json());
app.use(cookieParser());

/*app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
})); // session secret
app.use(passport.initialize());
app.use(passport.session());*/ // persistent login sessions

//Create tables if not exists
User.sync().then(() => {
    console.log('User table created successfully!');
}).catch((error) => {
    console.error('Unable to create User table: ', error)
})
Product.sync().then(() => {
    console.log('Product table created successfully!');
}).catch((error) => {
    console.error('Unable to create Product table: ', error)
})
UserBorrowProduct.sync().then(() => {
    console.log('UserBorrowProduct table created successfully!');
}).catch((error) => {
    console.error('Unable to create UserBorrowProduct table: ', error)
})

//routes
app.use('/api/signup', signup);
app.use('/api/signin', signin);
app.use('/api/select_locker', selectLocker);
app.use('/api/saveUserLockers', saveUserLockers);
app.use('/api/user', user);
app.use('/api/product', product)
app.use('/', express.static('public'));



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