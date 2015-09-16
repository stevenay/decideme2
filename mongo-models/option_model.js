var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var themeModel = require('./theme_model');
//var memberModel = require('./member_model');

var Option = new Schema({
    name: String,
    location: String,
    link: String,
    imageName: String,
    expiredDate: { type: Date },
    created_at: { type: Date },
    updated_at: { type: Date }
});

Option.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = mongoose.model('options', Option);