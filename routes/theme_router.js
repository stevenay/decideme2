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

    router.get('/', ensureAuthenticated, function(req, res) {
        var query = req.query;
        cardModel.find(query)
            .populate('participants')
            .exec( function(err, cards) {
                if (err) {
                    res.status(500);
                    res.send("has problems in searching cards");
                } else if (cards) {
                    res.json(cards);
                } else {
                    res.status(404).send("not found cards");
                }
            });
    })

    return router;
}

module.exports = themeRouter;