define([
    'jquery',
    'underscore',
    'backbone',
    'views/home.view',
    'views/member_board.view'
], function($, _, Backbone, HomeView, MemberBoardView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            'board': 'memberBoard',
            '*actions': 'defaultAction'
        }
    });

    var initialize = function () {
        var app_router = new AppRouter;
        app_router.on('route:memberBoard', function() {
            console.log("this is member board template");
            var memberBoardView = new MemberBoardView();
            memberBoardView.render();
        });
        app_router.on('route:defaultAction', function() {
            console.log("Router initialized");

            console.log("Facebook Login Check Here");

            var homeView = new HomeView();
            homeView.render();
        });

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});