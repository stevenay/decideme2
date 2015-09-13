var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var RememberMeStrategy = require('passport-remember-me').Strategy;
var utils = require('./utils');

var routes = require('./routes/index');
var memberRouter = require('./routes/member_router');
var cardRouter = require('./routes/card_router');
var themeRouter = require('./routes/theme_router');

var app = express();

// Creating models
var memberModel = require('./mongo-models/member_model');
var rememberMeModel = require('./mongo-models/remember-me-token_model');
var cardModel = require('./mongo-models/card_model');
var themeModel = require('./mongo-models/theme_model');

//uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
//app.use(logger('dev'));
app.use(multer({ dest: "#{__root}/public/img/covers/" } ));
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
app.use('/api/cards', cardRouter(cardModel));
app.use('/api/themes', themeRouter(themeModel));

// passport config
passport.use(memberModel.createStrategy());
passport.serializeUser(memberModel.serializeUser());
passport.deserializeUser(memberModel.deserializeUser());

passport.use(new RememberMeStrategy(
    function(token, done) {
        rememberMeModel.consumeToken(token, function (err, userId) {
            if (err) { return done(err); }
            if (!userId) { return done(null, false); }

            memberModel.findOne({'_id': userId}, function(err, member) {
                if (err) { return done(err); }
                if (!member) { return done(null, false); }
                return done(null, member);
            });
        });
    },
    function(user, done) {
        var token = utils.randomString(64);
        rememberMeModel.saveToken(token, user._id, function(err) {
            if (err) { return done(err); }
            return done(null, token);
        });
    }
));

//function consumeRememberMeToken(token, fn) {
//
//    rememberMeModel.findOneAndRemove({ 'token': token }, function (err, rememberMeToken) {
//        if (err) return err;
//
//        if (!rememberMeToken) { return fn(err, null); }
//
//        memberModel.findOne({'_id': rememberMeToken.userId}, function(err, member) {
//            return fn(null, member);
//        });
//    });
//
//};

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
