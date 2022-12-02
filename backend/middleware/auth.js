const {User} = require("../database/models/user");

//Authentication middleware
module.exports = {
    auth: function(req, res, next) {
        if (req.path == '/api/signup') {
            return next();
        } else if (req.path.startsWith('/api/user') || req.path.startsWith('/api/signin')) {
            return next();
        } else if (!req.path.startsWith('/api/products') && req.path.startsWith('/api/product') && req.method == 'GET') {
            return next();
        } else if (req.path.startsWith('/api/provinces') && req.method == 'GET') {
            return next();
        } else if (!req.path.startsWith('/api/')) {
            return next();
        } else if (req.path.startsWith('/api/forgotPassword') || req.path.startsWith('/api/resetPassword')){
            return next();
        }

        if (req.get('Auth-Token')) {
            User.findOne({
                where: {
                    token: req.get('Auth-Token'),
                },
                attributes: ['email']
            }).then((user) => {
                if (!user) {
                    res.sendStatus(401);
                } else {
                    next();
                }
            }, (error) => {
                console.error(error);
            })
        } else {
            res.sendStatus(401);
        }
    }
}
