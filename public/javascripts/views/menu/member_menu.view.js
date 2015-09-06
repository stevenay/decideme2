define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/member_menu.template.html'
], function($, _, Backbone, homeMenuTemplate) {

    var HomeMenuView = Backbone.View.extend({
        el: $('nav.navbar'),

        render: function () {
            var that = this;

            var compiledTemplate = _.template(homeMenuTemplate);
            this.$el.html(compiledTemplate);
        }
    });

    return HomeMenuView;

});