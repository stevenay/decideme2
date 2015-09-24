var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Member = new Schema({
    email: String,
    password: String,
    memberType: String,
    created_at: { type: Date },
    updated_at: { type: Date }
});

Member.pre('save', function(next) {
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

//Card.pre('update', function(next) {
//
//});

Member.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('members', Member);