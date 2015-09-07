define([
    'jquery',
    'underscore',
    'backbone',
    'models/theme.model'
], function($, _, Backbone, ThemeModel){
    var ThemesCollection = Backbone.Collection.extend({
        model: ThemeModel,

        initialize: function(models, options) {},

        url: '/api/themes/'

    });

    return ThemesCollection;
});
