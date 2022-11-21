const {User} = require("../database/models/user");

//Authentication middleware
module.exports = {
    auth: function(req, res, next) {
        if (req.path == '/api/signup') {
            return next();
        } else if (req.path.startsWith('/api/user') || req.path.startsWith('/api/signin')) {
            return next();
        } else if (req.path.startsWith('/api/product') && req.method == 'GET') {
            return next();
        }
        if (req.get('token')) {
            User.findOne({
                where: {
                    token: req.get('token'),
                }
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
