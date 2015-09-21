define([
    'backbone',
    'collections/option.collection',
], function (Backbone, OptionCollection) {

    var Card = Backbone.Model.extend({
        defaults: {
            question: '',
            description: '',
            theme: '',
            linkUrl: ''
        },

        initialize: function() {
            this.optionCollection = new OptionCollection;
            this.optionCollection.url = '/api/options?card=' + this.id;
        },

        idAttribute: "_id"
    });

    return Card;

});