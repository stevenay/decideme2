var express = require('express');
var mongoose = require('mongoose');

var routes = function(cardModel) {
    var optionRouter = express.Router();
    var utils = require('../utils');

    // Register new card
    optionRouter.post('/', utils.ensureAuthenticated, function(req, res) {
        //var castedParticipants = req.body.participants.map(function( participant ) {
        //    return mongoose.Types.ObjectId(participant);
        //});

        var card = new cardModel({
            question: req.body.question,
            description: req.body.description,
            theme: req.body.themeId,
            owner: req.user._id,
            status: 'created',
            linkUrl: 'auto generate from the Server'
        });

        console.log("it reached here");

        card.save(function(err, savedCard) {
            if (err) { console.log(err); res.status(500).send("Cannot save card"); }
            return res.status(200).send(savedCard._id);
        });
    });

    // Get All Cards
    cardRouter.get('/', utils.ensureAuthenticated, function(req, res) {
        var query = req.query;
        cardModel.find(query)
            .populate('participants')
            .sort({created_at: 'ascending'})
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
    });

    // middleware for Retrieving Card Object
    cardRouter.use('/:cardId', function(req, res, next) {
        Card.findById(req.params.cardId, function(err, card) {
            if (err) {
                res.status(500).send(err);
            } else if (card) {
                req.card = card;
                next();
            } else {
                res.status(404).send("no card found");
            }
        });
    });

    // Update card info
    cardRouter.put('/', utils.ensureAuthenticated, function (req, res) {
        var castedParticipants = req.body.participants.map(function( participant ) {
            return mongoose.Types.ObjectId(participant);
        });

        req.card.question = req.body.question;
        req.card.expiredDate = req.body.expiredDate;
        req.card.description = req.body.description;
        req.card.theme = req.body.themeId;
        req.card.owner = req.user._id;
        req.card.linkUrl = req.body.linkUrl;
        req.card.participants = castedParticipants;

        req.card.save(function(err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.json(req.card);
            }
        });
    });

    return cardRouter;
}

module.exports = routes;