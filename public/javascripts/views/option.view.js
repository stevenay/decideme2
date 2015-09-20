define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/option.template.html'
], function($, _, Backbone, optionTemplate) {

    var OptionView = Backbone.View.extend({
        tagName: 'div',
        className: 'col-md-3 col-sm-4 col-xs-6',
        template: _.template(optionTemplate),

        render: function () {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        }
    });

    return OptionView;

});