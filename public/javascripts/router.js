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
            var memberBoardView = new MemberBoardView();
            memberBoardView.render();
        });
        app_router.on('route:defaultAction', function() {
            console.log("Router initialized");
            console.log("Facebook Login Check Here");

            var url = '/api/members/check-authentication'

            $.ajax({
                url: url,
                type: 'get',
                success:function (data, textStatus, xhr) {
                    console.log(["Login request details: ", data]);

                    if(data.error) {  // If there is an error, show the error messages
                        console.log(data.error.text);
                    }

                    if (xhr.status == 200) {
                        Backbone.history.navigate('board', {trigger: true});
                    }
                    else if (xhr.status == 401) {
                        var homeView = new HomeView();
                        homeView.render();
                    }
                }
            });
        });

        Backbone.history.start();
    };

    return {
        initialize: initialize
    };
});