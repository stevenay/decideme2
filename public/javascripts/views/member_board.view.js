define([
    'jquery',
    'underscore',
    'backbone',
    'views/card.view',
    'collections/card.collection',
    'text!templates/member_board.template.html'
], function($, _, Backbone, CardView, CardCollection, memberBoardTemplate){

    var MemberBoardView = Backbone.View.extend({
        el: $('#js-member-board-view'),

        initialize: function() {
            this.collection = new CardCollection();
            this.collection.fetch({reset: true});

            this.listenTo( this.collection, 'add', this.renderCard );
            this.listenTo( this.collection, 'reset', this.render );
        },

        events: {
            'click #add': 'addBook'
        },

        close: function() {
            this.$el.hide();
        },

        render: function() {
            //this.$el.hide();
            this.$el.html(memberBoardTemplate);
            this.renderAllCards();
        },

        renderAllCards: function() {
            console.log("Render All Cards");
            this.collection.each( function (card) {
                this.renderCard(card);
            }, this );
        },

        renderCard: function(card) {
            var cardView = new CardView({ model: card });
            this.$el.find('#cardBoard').append( cardView.render().el );
        }
    });

    return MemberBoardView;

});