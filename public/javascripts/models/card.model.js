define([
    'backbone'
], function (Backbone) {

    var Card = Backbone.Model.extend({
        defaults: {
            question: '',
            expiredDate: Date.now(),
            description: '',
            theme: '',
            linkUrl: ''
        }
    });

    return Card;

});