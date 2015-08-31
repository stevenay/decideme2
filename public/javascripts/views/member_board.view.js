define([
    'jquery',
    'underscore',
    'backbone',
    'views/menu/homemenu.view',
    'text!templates/member_board.template.html'
], function($, _, Backbone, HomeMenuView, memberBoardTemplate){

    var MemberBoardView = Backbone.View.extend({
        el: $('#page'),

        render: function() {
            var homeMenuView = new HomeMenuView();
            homeMenuView.render();

            this.$el.html(memberBoardTemplate);
        }
    });

    return MemberBoardView;

});