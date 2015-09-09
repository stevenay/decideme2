var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Theme = new Schema({
    themeName: String,
    mainColorCode: String
});

module.exports = mongoose.model('themes', Theme);