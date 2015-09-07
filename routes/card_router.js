var express = require('express');
var mongoose = require('mongoose');

var cardRouter = function(cardModel) {
    var router = express.Router();
    var utils = require('../utils');

    // Register new card
    router.post('/', ensureAuthenticated, function(req, res) {
        var castedParticipants = req.body.participants.map(function( participant ) {
            return mongoose.Types.ObjectId(participant);
        });

        var card = new cardModel({
            question: req.body.question,
            expiredDate: req.body.expiredDate,
            description: req.body.description,
            theme: req.body.themeId,
            owner: req.user._id,
            linkUrl: req.body.linkUrl,
            participants: castedParticipants
        });

        console.log("it reached here");

        card.save(function(err, savedCard) {
            if (err) { console.log(err); res.status(500).send("Cannot save card"); }
            return res.status(200).send(savedCard._id);
        });
    });

    // Update card info
    router.put('/')


    // Get All Cards
    router.get('/', utils.ensureAuthenticated, function(req, res) {
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
    });

    return router;
}

module.exports = cardRouter;