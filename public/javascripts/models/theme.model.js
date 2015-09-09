define([
    'backbone'
], function (Backbone) {

    var Theme = Backbone.Model.extend({
        defaults: {
            themeName: '',
            mainColorCode: '',
            selected: false
        },

        setAllFalse: function () {
            this.set({
                selected: true
            });
        }
    });

    return Theme;

});