define([
    'jquery',
    'underscore',
    'backbone',
    'models/card.model'
], function($, _, Backbone, CardModel){
    var CardsCollection = Backbone.Collection.extend({
        model: CardModel,

        initialize: function(models, options) {},

        url: '/api/cards/'

    });

    return CardsCollection;
});
