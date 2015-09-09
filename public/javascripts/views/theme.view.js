define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    var ThemeView = Backbone.View.extend({
        tagName: 'div',
        events: {
            'click': 'selectTheme'
        },

        render: function () {
            this.$el.html( "&nbsp;" );
            return this;
        },

        selectTheme: function () {
            this.model.set('selected', true);
            this.$el.addClass('active');
            this.$el.siblings().removeClass('active');
        },

        attributes: function () {
            return {
                'data-color': this.model.get('themeName'),
                'style': 'background-color:' + this.model.get('mainColorCode')
            };
        }
    });

    return ThemeView;

});