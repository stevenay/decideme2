var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var themeModel = require('./theme_model');
//var memberModel = require('./member_model');

var Card = new Schema({
    question: String,
    description: String,
    theme: { type: Schema.Types.ObjectId, ref: 'themes' },
    owner: { type: Schema.Types.ObjectId, ref: 'members' },
    linkUrl: String,
    status: { type: String, default: 'processing' },
    participants: [{ type:Schema.Types.ObjectId, ref: 'members' }],
    created_at: { type: Date },
    updated_at: { type: Date }
});

Card.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if ( !this.created_at ) {
        this.created_at = now;
    }
    next();
});

module.exports = mongoose.model('cards', Card);