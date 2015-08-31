var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
var utils = require('./utils');

var routes = require('./routes/index');
var memberRouter = require('./routes/member_router');

var app = express();

// Creating models
var memberModel = require('./mongo-models/member_model');
var rememberMeModel = require('./mongo-models/remember-me-token_model');

//uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api/members', memberRouter(memberModel, rememberMeModel));

// passport config
passport.use(memberModel.createStrategy());
passport.serializeUser(memberModel.serializeUser());
passport.deserializeUser(memberModel.deserializeUser());

passport.use(new RememberMeStrategy(
    function(token, done) {
        consumeRememberMeToken(token, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        });
    },
    function(user, done) {
        var token = utils.randomString(64);
        saveRememberMeToken(token, { userId: user._id }, function(err) {
            if (err) { return done(err); }
            return done(null, token);
        });
    }
));

function consumeRememberMeToken(token, fn) {

    rememberMeModel.findOneAndRemove({ 'token': token }, function (err, rememberMeToken) {
        if (err) return err;

        memberModel.findOne({'_id': rememberMeToken.userId}, function(err, member) {
            return fn(null, member);
        });
    });

};

function saveRememberMeToken(token, user, fn) {
    var newToken = new rememberMeModel({
        userId: user.userId,
        token: token
    });

    newToken.save(function (err, token) {
        if (err) return console.error(err);
        return fn();
    });
};

// mongoose
mongoose.connect('mongodb://localhost/decideme2');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500).send(err);
        //res.render('error', {
        //  message: err.message,
        //  error: err
        //});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500).send(err);
    //res.render('error', {
    //    message: err.message,
    //    error: {}
    //});
});


module.exports = app;
