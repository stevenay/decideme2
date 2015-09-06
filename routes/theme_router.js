var express = require('express');

var themeRouter = function(themeModel) {
    var router = express.Router();

    // Register new member
    router.post('/', function(req, res) {
        var theme = new themeModel({
            mainColorCode: req.body.mainColorCode
        });

        theme.save(function(err, savedTheme) {
            if (err) return res.status(500).send("Cannot save theme");
            res.status(200).send("Save successful");
        });
    });

    return router;
}

module.exports = themeRouter;