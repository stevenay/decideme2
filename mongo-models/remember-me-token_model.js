var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var tokenPlugin = require('./remember-me-token-plugin');

var RememberMeToken = new Schema({
    userId: String,
    token: String,
    registerDate: { type: Date, default: Date.now }
});

RememberMeToken.plugin(tokenPlugin);

module.exports = mongoose.model('remember_me_tokens', RememberMeToken);