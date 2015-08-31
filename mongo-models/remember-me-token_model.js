var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RememberMeToken = new Schema({
    userId: String,
    token: String,
    registerDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('remember_me_tokens', RememberMeToken);