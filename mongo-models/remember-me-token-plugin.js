module.exports = exports = function lastModifiedPlugin (schema, options) {
    schema.statics.saveToken = function(token, userId, cb) {
        // Create an instance of this in case user isn't already an instance
        var newToken = new this({
            userId: userId,
            token: token
        });

        newToken.save(function (err, token) {
            //if (err) return console.error(err);
            return cb(err);
        });
    };

    schema.statics.consumeToken = function(token, cb) {
        var self = this;

        self.findOneAndRemove({ 'token': token }, function (err, rememberMeToken) {
            if (err) { return err; }
            if (!rememberMeToken) { return cb(err, null); }
            return cb(null, rememberMeToken.userId);
        });
    }
}