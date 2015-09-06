define([
    'backbone'
], function (Backbone) {

    var Theme = Backbone.Model.extend({
        defaults: {
            mainColorCode: ''
        }
    });

    return Theme;

});