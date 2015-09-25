var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var imageType = require('image-type');
var crypto = require('crypto');
var path = require('path');

var storage = multer.diskStorage({
    destination: __dirname + '/../public/images/options/',
    filename: function (req, file, cb) {
        console.log(file.originalname);
        crypto.pseudoRandomBytes(16, function (err, raw) {
            if (err) return cb(err);

            cb(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
});
var upload = multer({
    storage: storage,
    limits: {fileSize: 1000000, files:1}
});

var routes = function(optionModel) {
    var optionRouter = express.Router();
    var utils = require('../utils');

    // Register new option
    optionRouter.post('/', utils.ensureAuthenticated, upload.single('file'), function(req, res) {
        var option = new optionModel({
            name: req.body.name,
            location: req.body.location,
            link: req.body.link,
            imageName: req.file.filename,
            expiredDate: req.body.expiredDate,
            card: req.body.cardId
        });

        option.save(function(err, savedOption) {
            if (err) { console.log(err); res.status(500).send("Cannot save option!"); }
            res.json(savedOption);
        });
    });

    // Update option
    optionRouter.patch('/vote/:optionId', utils.ensureAuthenticated, getOptionModel, function (req, res) {

        var updateClause, voteCounted;
        var indexOfMember = req.option.voters.indexOf(req.user._id);
        var vote;
        voteCounted = (req.option.voteCount) ? req.option.voteCount : 0;

        if ( indexOfMember > -1  ) {
            vote = false;
            updateClause = {$pull: {voters: req.user._id}, voteCount: --voteCounted};
        }
        else {
            vote = true;
            updateClause = { $addToSet: { voters: req.user._id}, voteCount: ++voteCounted };
        }

        optionModel.findByIdAndUpdate(req.params.optionId, updateClause, function(err, option) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.json({ voteCount: voteCounted, voted: vote });
            }
        });
    });

    optionRouter.put('/:optionId', utils.ensureAuthenticated, getOptionModel, function (req, res) {
        req.option.voteCount = req.body.voteCount;

        req.option.save(function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(req.option);
            }
        });
    });

    // Get All Options
    optionRouter.get('/', utils.ensureAuthenticated, function(req, res) {
        var query = req.query;
        optionModel.find(query)
            .sort({created_at: 'ascending'})
            .exec( function(err, options) {
                if (err) {
                    res.status(500);
                    res.send("has problems in searching options");
                } else if (options) {
                    res.json(options);
                } else {
                    res.status(404).send("not found options");
                }
            });
    });

    // utils
    function getOptionModel (req, res, next) {
        optionModel.findById(req.params.optionId, function(err, option) {
            if (err) {
                res.status(500).send(err);
            } else if (option) {
                req.option = option;
                next();
            } else {
                res.status(404).send("no option found");
            }
        });
    }

    return optionRouter;
}

module.exports = routes;
//Most people do looking images' `mime type` and `file extension` to know they are in right image file format.
//
//As these kinds of validations are not secure enough,