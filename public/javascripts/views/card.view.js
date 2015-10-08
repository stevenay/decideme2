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
        initialize: function() {
            this.listenTo(this.model, "change:status", this.setCardStatus);
        },
        events: {
            'click .delete': 'deleteBook'
        },

        render: function () {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        },
        setCardStatus: function (card, changedStatus) {
            this.$('#span-status').html(changedStatus);
        }
    });

    return CardView;

});