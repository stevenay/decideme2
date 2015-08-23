var express = require('express');
var passport = require('passport');
var Member = require('../mongo-models/member');
var router = express.Router();

/* GET users listing. */
router.post('/register', function(req, res) {
    Member.register(new Member({
            eamil: req.body.email,
            memberType: req.body.memberType,
            registerDate: req.body.registerDate
        }),
        req.body.password, function (err, member) {
            if (err) {
                return res.send('error occured');
            }

            passport.authenticate('local')(req, res, function () {
                res.send('hello again');
            });
        });

    //return member.save( function(err) {
    //    if (!err) {
    //        console.log('Member saved');
    //        return res.send(member);
    //    } else {
    //        console.log(err);
    //    }
    //});
});

router.post('/login',
    passport.authenticate('local', { failureRedirect: '/profile' }),
    function(req, res) {
        res.send("successful login");
    });

router.get('/profile',
    //ensureLoggedIn(),
    function(req, res) {
        console.log("Connect Ensure Login");
        res.send("Hello");
    });

module.exports = router;