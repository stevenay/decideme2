var express = require('express');

var routes = function(themeModel) {
    var themeRouter = express.Router();
    var utils = require('../utils');

    // Register new theme
    themeRouter.post('/', utils.ensureAuthenticated, function(req, res) {
        var theme = new themeModel({
            themeName: req.body.themeName,
            mainColorCode: req.body.mainColorCode
        });

        theme.save(function(err, savedTheme) {
            if (err) return res.status(500).send("Cannot save theme");
            res.status(200).send("Save successful");
        });
    });

    // Get all themes
    themeRouter.get('/', utils.ensureAuthenticated, function(req, res) {
        var query = req.query;
        themeModel.find(query)
            .exec( function(err, themes) {
                if (err) {
                    res.status(500);
                    res.send("has problems in searching cards");
                } else if (themes) {
                    res.json(themes);
                } else {
                    res.status(404).send("not found themes");
                }
            });
    });

    // middleware for Retrieving Card Object
    themeRouter.use('/:themeId', function(req, res, next) {
        themeModel.findById(req.params.themeId, function(err, theme) {
            if (err) {
                res.status(500).send(err);
            } else if (theme) {
                req.theme = theme;
                next();
            } else {
                res.status(404).send("no theme found");
            }
        });
    });

    // Update a theme
    themeRouter.put('/:themeId', utils.ensureAuthenticated, function (req, res) {

        req.theme.themeName = req.body.themeName;
        req.theme.mainColorCode = req.body.mainColorCode;

        req.theme.save(function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(req.theme);
            }
        });
    });

    return themeRouter;
}

module.exports = routes;