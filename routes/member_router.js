var express = require('express');

var memberRouter = function(memberModel, rememberMeModel) {

    var router = express.Router();
    var passport = require('passport');
    var utils = require('../utils');

    // Register new member
    router.post('/', function(req, res) {
        memberModel.register(new Member({
                email: req.body.email,
                memberType: req.body.memberType,
                registerDate: req.body.registerDate
            }), req.body.password,
            function (err, member) {
                if (err) {
                    return res.status(500).send(err);
                }
                passport.authenticate('local')(req, res, function () {
                    res.send('hello again');
                });
            });
    });

    // Login member
    router.post('/login', function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.status(200).json({ status: 'login_fail' }); }

            req.logIn(user, function(err) {
                if (err) { return next(err); }
                next();
            });
        })(req, res, next);
    }, function(req, res, next) {
        issueToken(req.user, function(err, token) {
            if (err) { return next(err); }
            res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
            return next();
        });
    }, function(req, res, next) {
        return res.status(200).json({status: 'login_success'});
    });

    // Logout member
    router.get('/logout', function(req, res) {
        res.clearCookie('remember_me');
        req.logout();
        res.json({'status':'logout_success'});
    });

    // Check member authentication
    router.get('/check-authentication',
        utils.ensureAuthenticated,
        function(req, res) {
            res.json({ status: 'authorized' });
        });

    // Get particular member
    router.get('/:memberId',
        utils.ensureAuthenticated,
        function(req, res) {
            memberModel.findById(req.params.memberId, function(err, member) {
                if (err) {
                    res.status(500);
                    res.send("has problems in searching member");
                } else if (member) {
                    res.json(member);
                } else {
                    res.status(404).send("not found member");
                }
            });
        });

    // Get all members
    router.get('/',
        function(req, res) {
            var query = req.query;
            memberModel.find(query, function(err, members) {
                if (err) {
                    res.status(500);
                    res.send("has problems in searching members");
                } else if (members) {
                    res.json(members);
                } else {
                    res.status(404).send("not found members");
                }
            });
        });


    function issueToken(user, done) {
        var token = utils.randomString(64);
        rememberMeModel.saveToken(token, user._id, function(err) {
            if (err) { return done(err); }
            return done(null, token);
        });
    };

    return router;
}

module.exports = memberRouter;