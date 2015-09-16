var express = require('express');
var mongoose = require('mongoose');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: __dirname + '/../public/images/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now());
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