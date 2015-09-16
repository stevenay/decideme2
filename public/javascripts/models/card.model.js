define([
    'backbone'
], function (Backbone) {

    var Card = Backbone.Model.extend({
        defaults: {
            question: '',
            description: '',
            theme: '',
            linkUrl: ''
        },

        idAttribute: "_id"
    });

    return Card;

});