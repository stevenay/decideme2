define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/card_detail.template.html'
], function($, _, Backbone, cardDetailTemplate) {

    var CardView = Backbone.View.extend({
        tagName: 'div',
        className: 'container',
        template: _.template(cardDetailTemplate),

        render: function () {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        }
    });

    return CardView;

});