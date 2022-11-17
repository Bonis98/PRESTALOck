module.exports = {
    is_logged_in: function (req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect(302, '/api/signin');
    },

    is_guest: function (req, res, next) {
        if (!req.isAuthenticated())
            return next();
        res.redirect(302, '/')
    }
}