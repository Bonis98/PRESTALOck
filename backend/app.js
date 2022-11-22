const fs = require('fs');
const express = require('express');
const https = require('https');
const http = require('http');
const helmet = require("helmet");
require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const middleware = require('./middleware/auth')
const signup = require('./routes/signup');
const signin = require('./routes/signin');
const signinGoogle = require('./routes/signinGoogle');
const lockersList = require('./routes/lockersList');
const saveUserLockers = require("./routes/saveUserLockers");
const user = require('./routes/user');
const product = require('./routes/product');
const products = require ('./routes/products');
const {User} = require("./database/models/user");
const {Product} = require("./database/models/product");
const {UserBorrowProduct} = require("./database/models/userBorrowProduct");

const app = express();
const port = 443;

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    scriptSrc: ["'self'", "'unsafe-inline'"]
  }
}));
app.use(bodyParser.json());
app.use(cookieParser());

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
//Authentication middleware
app.use(middleware.auth);
app.use('/api/signup', signup);
app.use('/api/signin', signin);
app.use('/api/signinGoogle', signinGoogle);
app.use('/api/lockersList', lockersList);
app.use('/api/saveUserLockers', saveUserLockers);
app.use('/api/user', user);
app.use('/api/product', product)
app.use('/api/products', products);
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