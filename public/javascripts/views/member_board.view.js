define([
    'jquery',
    'underscore',
    'backbone',
    'views/card.view',
    'views/theme.view',
    'collections/card.collection',
    'collections/theme.collection',
    'text!templates/member_board.template.html'
], function($, _, Backbone, CardView, ThemeView, CardCollection, ThemeCollection, memberBoardTemplate){

    var MemberBoardView = Backbone.View.extend({
        //el: $('#js-member-board-view'),

        initialize: function() {
            this.collection = new CardCollection();
            this.collection.fetch({reset: true});
            console.log("It Initialize");

            this.themeCollection = new ThemeCollection();
            this.themeCollection.fetch({reset: true});

            this.listenTo( this.collection, 'add', this.renderCard );
            this.listenTo( this.collection, 'reset', this.render );

            this.listenTo( this.themeCollection, 'reset', this.renderThemes );
        },

        events: {
            'click #btn-create-card': 'addCard'
        },

        show: function() {
            this.$el.toggle();
            return this;
        },

        close: function() {
            this.$el.toggle();
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
        },

        renderThemes: function() {
            this.themeCollection.each( function (theme) {
                this.renderTheme(theme);
            }, this);
        },

        renderTheme: function(theme) {
            var themeView = new ThemeView({ model: theme });
            this.$el.find('div.colors').append( themeView.render().el );
        },

        addCard: function(e) {
            e.preventDefault();

            var formData = {};

            $( '#modal-new-card form' ).children( 'input' ).each( function( i, el ) {
                if ( $(el).val() != '' ) {

                    // el.id is the Javascript code
                    formData[ el.id ] = $(el).val();

                }
                $(el).val('');
            });
        }
    });

    return MemberBoardView;

});