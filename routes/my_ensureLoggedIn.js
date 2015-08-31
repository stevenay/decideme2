module.exports = function my_ensureLoggedIn(options) {
    options = options || {};
    var setReturnTo = (options.setReturnTo === undefined) ? true : options.setReturnTo;

    return function(req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {

            if (setReturnTo && req.session) {
                req.session.returnTo = req.originalUrl || req.url;
            }
            res.status(401).send("Unauthorized access");
            return;

        }
        next();
    }
}