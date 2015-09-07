define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/theme.template.html'
], function($, _, Backbone, themeTemplate) {

    var ThemeView = Backbone.View.extend({
        tagName: 'div',
        className: '',
        template: _.template(themeTemplate),
        events: {
            'click': 'selectTheme'
        },

        render: function () {
            this.$el.html( this.template( this.model.toJSON() ) );
            return this;
        },

        selectTheme: function () {
            this.$el.addClass('active');
            this.$el.siblings().removeClass('active');
        }
    });

    return ThemeView;

});