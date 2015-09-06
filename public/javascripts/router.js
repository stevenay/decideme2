define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryCookie',
    'views/menu/home_menu.view',
    'views/home.view',
    'views/menu/member_menu.view',
    'views/member_board.view'
], function($, _, Backbone, Cookie, HomeMenuView, HomeView, MemberMenuView, MemberBoardView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            'home': 'landingPage',
            'board': 'memberBoard',
            'helloWorld/:num': 'sayHello',
            '*actions': 'defaultAction'
        },
        requresAuth: ['helloWorld'],
        preventAccessWhenAuth : ['#login'],
        before: function (params, next) {
            var isAuth = this.checkAuthentication();
            var path = Backbone.history.location.hash;
            var needAuth = _.contains(this.requresAuth, path);
            var cancelAccess = _.contains(this.preventAccessWhenAuth, path);

            if (needAuth && !isAuth){
                Session.set('redirectFrom', path);
                Backbone.history.navigate('login', { trigger : true });
            } else if(isAuth && cancelAccess){
                Backbone.history.navigate('', { trigger : true });
            } else{
                return next();
            }
        },

        checkAuthentication: function() {
            var url = '/api/members/check-authentication';
            var auth = false;
            $.ajax({
                url: url,
                type: 'get',
                timeout: 5000,
                success: function (data, textStatus, xhr) {
                    if (data.error)  // If there is an error, show the error messages
                        console.log(data.error.text);

                    if (xhr.status == 200) {
                        console.log(data);
                        if (data.status == 'not_authorized') {
                            auth = false;
                        } else if (data.status == 'authorized') {
                            auth = true;
                        }
                    }
                },
                error: function (xhr, textStatus) {
                    if (xhr.status == 401) {
                        auth = false;
                    }
                }
            });

            return auth;
        },

        initialize: function() {},

        homeMenuView: function() {
            if (this._homeMenuView == null)
                this._homeMenuView = new HomeMenuView();

            return this._homeMenuView;
        },
        memberMenuView: function() {
            if (this._memberMenuView == null)
                this._memberMenuView = new MemberMenuView();

            return this._memberMenuView;
        },
        homeView: function() {
            // check both undefined and null simutaneously
            if (this._homeView == null)
                this._homeView = new HomeView();

            return this._homeView;
        },
        memberBoardView: function() {
            // check both undefined and null simutaneously
            if (this._memberBoardView == null)
                this._memberBoardView = new MemberBoardView();

            return this._memberBoardView;
        },
        setMenuView: function(view) {
            // don't close the MenuView because they will exist in every pages of the app
            // if (this.currentMenuView)
            //    this.currentMenuView.close();

            this.currentMenuView = view;
            this.currentMenuView.show(true);
        },
        setBodyView: function(view, willShow) {
            willShow = typeof willShow !== 'undefined' ? willShow : true;

            if (this.currentBodyView)
                this.currentBodyView.close();

            this.currentBodyView = view;
            this.currentBodyView.show(willShow);
        }
    });

    var initialize = function () {
        var app_router = new AppRouter;
        app_router.on('route:memberBoard', function() {
            this.setMenuView(this.memberMenuView());
            this.setBodyView(this.memberBoardView(), false);
        });
        app_router.on('route:sayHello', function(someNum) {
            console.log("SayHello");
            app_router.memberBoardView().remove();
        });
        app_router.on('route:landingPage', function() {
            this.setMenuView(app_router.homeMenuView());
            this.setBodyView(app_router.homeView());
        });
        app_router.on('route:defaultAction', function() {
            console.log("Router initialized");
            console.log("Facebook Login Check Here");

            var url = '/api/members/check-authentication';
            $.ajax({
                url: url,
                type: 'get',
                timeout: 5000,
                success: function (data, textStatus, xhr) {
                    if (data.error)  // If there is an error, show the error messages
                        console.log(data.error.text);

                    if (xhr.status == 200) {
                        console.log(data);
                        if (data.status == 'not_authorized') {
                            Backbone.history.navigate('home', {trigger: true});
                        } else if (data.status == 'authorized') {
                            Backbone.history.navigate('board', {trigger: true});
                        }
                    }
                },
                error: function (xhr, textStatus) {
                    if (xhr.status == 401) {
                        Backbone.history.navigate('home', {trigger: true});
                    }
                }
            });
        });
        app_router.on('route:logout', function() {
            var url = '/api/members/logout';
            $.ajax({
                url: url,
                type: 'get',
                timeout: 5000,
                success: function (data, textStatus, xhr) {
                    if (data.error)  // If there is an error, show the error messages
                        console.log(data.error.text);

                    if (xhr.status == 200) {
                        console.log(data);
                        if (data.status == 'logout_success') {
                            Backbone.history.navigate('home', {trigger: true});
                        }
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