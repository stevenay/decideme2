var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Member = new Schema({
    email: String,
    password: String,
    memberType: String,
    registerDate: Date
});

Member.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('members', Member);