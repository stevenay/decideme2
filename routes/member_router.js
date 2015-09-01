var express = require('express');

var memberRouter = function(Member, rememberMeModel) {

    var router = express.Router();
    var passport = require('passport');
    var utils = require('../utils');

    // Register new member
    router.post('/', function(req, res) {
        Member.register(new Member({
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
            if (!user) { console.log("Unsuccessful"); return res.status(401).send('Unsuccessful login'); }

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
        return res.status(200).send("Successful login");
    });

    // Check member authentication
    router.get('/check-authentication',
        ensureAuthenticated,
        function(req, res) {
            res.status(200).send("Authorized");
        });

    // Get particular member
    router.get('/:memberId',
        ensureAuthenticated,
        function(req, res) {
            Member.findById(req.params.memberId, function(err, member) {
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
            Member.find(query, function(err, members) {
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

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) { return next(); }
        res.status(401).send('Unauthorized access');
    };

    return router;
}


module.exports = memberRouter;