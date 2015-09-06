define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/card.template.html'
], function($, _, Backbone, cardTemplate) {

    var CardView = Backbone.View.extend({
        tagName: 'div',
        className: 'col-md-4 col-sm-5 card',
        template: _.template(cardTemplate),
        events: {
            'click .delete': 'deleteBook'
        },

        render: function () {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        }
    });

    return CardView;

});