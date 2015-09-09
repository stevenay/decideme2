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
        tagName: 'span',

        initialize: function() {
            this.collection = new CardCollection();
            this.collection.fetch({reset: true});

            this.themeCollection = new ThemeCollection();
            this.themeCollection.fetch({reset: true});

            this.listenTo( this.collection, 'add', this.renderCard );
            this.listenTo( this.collection, 'reset', this.render );

            this.listenTo( this.themeCollection, 'reset', this.renderThemes );
            //this.themeCollection.on("change:selected", this.themeSelected , this);
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

            //this.$newCardModal = this.$('#modal-new-card');
            this.$modal = this.$('#modal-new-card');
            this.$form = this.$modal.find('form');
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

        renderTheme: function(theme) {
            var themeId = theme.get('_id');
            var themeName = theme.get('themeName');
            var color = theme.get('mainColorCode');

            var $color = $('<div class="color"\
                            style="background:' + color + '"\
                            data-theme-id="' + themeId + '"\
                            data-color="' + themeName + '"></div>')
                .appendTo($('div.colors'))

            if (this.model.get('_id') == themeId)
                $color.addClass('active');
        },

        addCard: function(e) {
            e.preventDefault();

            var formData = {};

            this.$form.find( 'input' ).each( function( i, el ) {
                if ( $(el).val() != '' ) {
                    // el.id is the Javascript code
                    formData[ el.id ] = $(el).val();
                }
                $(el).val('');
            });

            var colorName = this.$form.find('.colors .active').data('color');
            formData['theme'] = this.themeCollection.findWhere({themeName: colorName}).get('_id');

            var $modal = this.$modal;
            this.collection.create( formData, {
                wait: true,    // waits for server to respond with 200 before adding newly created model to collection
                success: function (resp) {
                    console.log('success callback');
                    console.log(resp);
                    $modal.modal('hide');
                },
                error: function (err) {
                    console.log('error callback');
                    // this error message for dev only
                    alert('There was an error. See console for details');
                    console.log(err);
                }
            });
        }
    });

    return MemberBoardView;

});