var express = require('express');
var mongoose = require('mongoose');

var routes = function(cardModel) {
    var cardRouter = express.Router();
    var utils = require('../utils');

    // Register new card
    cardRouter.post('/', utils.ensureAuthenticated, function(req, res) {
        //var castedParticipants = req.body.participants.map(function( participant ) {
        //    return mongoose.Types.ObjectId(participant);
        //});

        var card = new cardModel({
            question: req.body.question,
            description: req.body.description,
            theme: req.body.theme,
            owner: req.user._id,
            status: 'preparing',
            linkUrl: 'auto generate from the Server'
        });

        console.log("it reached here");

        card.save(function(err, savedCard) {
            if (err) { console.log(err); res.status(500).send("Cannot save card"); }

            savedCard.populate({ path: 'theme', select: 'themeName'}, function(err, populatedCard) {
                console.log(populatedCard);
                return res.status(200).send(populatedCard);
            });

        });
    });

    // middleware for Retrieving Card Object
    cardRouter.use('/:cardId', function(req, res, next) {
        Card.findById(req.params.cardId)
            .exec( function(err, card) {
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
    cardRouter.get('/:cardId', utils.ensureAuthenticated, funtion(req, res) {
        req.card
            .populate('theme', 'themeName')
            .exec(function(err) {
                res.status(200).json(req.card);
            });
    });

    // Get All Cards
    cardRouter.get('/', utils.ensureAuthenticated, function(req, res) {
        var query = req.query;
        cardModel.find({
                owner: req.user._id
            })
            .populate('theme', 'themeName')
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