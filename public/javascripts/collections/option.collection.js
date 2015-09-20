define([
    'jquery',
    'underscore',
    'backbone',
    'models/option.model'
], function($, _, Backbone, OptionModel){
    var OptionsCollection = Backbone.Collection.extend({
        model: OptionModel,

        initialize: function(models, options) {},

        url: '/api/options/'

    });

    return OptionsCollection;
});
