define([
    'jquery',
    'underscore',
    'backbone',
    'models/option.model'
], function($, _, Backbone, OptionModel){
    var OptionsCollection = Backbone.Collection.extend({
        model: OptionModel,

        initialize: function(models, options) {},

        url: '/api/options/',

        setModelAttribute: function(attributes) {
            this.invoke('set', attributes);
            // NOTE: This would need to get a little more complex to support the
            //       set(key, value) syntax
        }

    });

    return OptionsCollection;
});
