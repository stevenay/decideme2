define([
    'jquery',
    'underscore',
    'backbone',
    'views/theme.view',
    'models/card.model'
    'collections/card.collection',
    'collections/theme.collection',
    'text!templates/member_board.template.html',
    'text!templates/'
], function($, _, Backbone, ThemeView, Card, CardCollection, ThemeCollection, memberBoardTemplate) {

    var NewCardView = Backbone.View.extend({
        el: '#view',

        events: {
            'blur input': 'preview',
            'click .color': 'toggleColor',
            'click #btn-create-card': 'addNewCard'
        },

        initialize: function () {
            this.model = new Card();

            this.collection = new ThemeCollection();
            this.collection.fetch({reset: true});

            this.listenTo( this.themeCollection, 'reset', this.renderThemes );
            this.setModelData();
        },

        toggleColor: function (e) {
            this.$('.active').removeClass('active')

            var el = e.currentTarget;
            var themeId = el.dataset.themeId;

            el.classList.add('active')

            this.model.set('themeId', themeId);
        },

        setModelData: function () {
            this.model.set('question', this.$('input#question').val());
            this.model.set('explanation', this.$('input#explanation').val());
        },

        renderThemes: function() {
            this.themeCollection.each( function (theme) {
                this.renderTheme(theme);
            }, this);
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

        addNewCard: function(e) {

        }

    });

    return NewCardView;
});