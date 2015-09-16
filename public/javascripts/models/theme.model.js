define([
    'backbone'
], function (Backbone) {

    var Theme = Backbone.Model.extend({
        defaults: {
            themeName: '',
            mainColorCode: '',
            selected: false
        },

        idAttribute: '_id',

        setAllFalse: function () {
            this.set({
                selected: true
            });
        }
    });

    return Theme;

});