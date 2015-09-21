define([
    'jquery',
    'underscore',
    'backbone',
    'magnific_popup',
    'text!templates/option.template.html'
], function($, _, Backbone, MagnificPopup, optionTemplate) {

    var OptionView = Backbone.View.extend({
        tagName: 'div',
        className: 'col-md-3 col-sm-4 col-xs-6',
        template: _.template(optionTemplate),

        render: function () {
            this.$el.html( this.template( this.model.toJSON() ) );

            this.$('.link-popup-image').magnificPopup({
                type: 'image'
            });

            return this;
        }
    });

    return OptionView;

});