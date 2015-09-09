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
    participants: [{ type:Schema.Types.ObjectId, ref: 'members' }]
});

module.exports = mongoose.model('cards', Card);