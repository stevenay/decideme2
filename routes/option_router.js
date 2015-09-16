var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var imageType = require('image-type');
var crypto = require('crypto');
var path = require('path');

var storage = multer.diskStorage({
    destination: __dirname + '/../public/images/',
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
    fileFilter: function (req, file, cb) {
        if (imageType(file).ext === "jpg") {
            // To accept the file pass `true`, like so:
            cb(null, true);
        } else {
            // To reject this file pass `false`, like so:
            cb(null, false);
        }
    }
});

var routes = function(optionModel) {
    var optionRouter = express.Router();
    var utils = require('../utils');

    // Register new option
    optionRouter.post('/:imageName', upload.single('file'), function(req, res) {

        console.log(req.file);

        var option = new optionModel({
            name: req.body.name,
            location: req.body.location,
            link: req.body.link,
            imageName: req.file.filename,
            expiredDate: req.body.expiredDate
        });

        option.save(function(err, savedOption) {
            if (err) { console.log(err); res.status(500).send("Cannot save option!"); }
            res.json(savedOption);
        });
    });

    return optionRouter;
}

module.exports = routes;
//Most people do looking images' `mime type` and `file extension` to know they are in right image file format.
//
//As these kinds of validations are not secure enough,