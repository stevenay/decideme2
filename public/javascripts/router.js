define([
    'jquery',
    'underscore',
    'backbone',
    'jqueryCookie',
    'views/menu/home_menu.view',
    'views/home.view',
    'views/menu/member_menu.view',
    'views/member_board.view'
], function($, _, Backbone, Cookies, HomeMenuView, HomeView, MemberMenuView, MemberBoardView) {

    var AppRouter = Backbone.Router.extend({
        routes: {
            'home': 'landingPage',
            'board': 'memberBoard',
            'helloWorld/:num': 'sayHello',
            '*actions': 'defaultAction'
        },
        notRequiresAuth: ['#home'],
        preventAccessWhenAuth : ['#login'],
        before: function (params, next) {
            var path = Backbone.history.location.hash;
            var notNeedAuth = _.contains(this.notRequiresAuth, path);
            var cancelAccess = _.contains(this.preventAccessWhenAuth, path);

            this.checkAuthentication(function (isAuth) {
                if (!notNeedAuth && !isAuth) {
                    Cookies.set('redirectFrom', path, {expires: 7});
                    Backbone.history.navigate('home', {trigger: true});
                } else if (cancelAccess && isAuth) {
                    Backbone.history.navigate('board', {trigger: true});
                } else {
                    return next();
                }
            });
        },
        checkAuthentication: function(cb) {
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
                },
                complete: function() {
                    console.log("Auth is " + auth);
                    cb(auth);
                    //return done(auth);
                }
            });
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
            $('#page').html(this.currentBodyView.show(willShow).el);
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
            console.log("Home Reached");
            this.setMenuView(app_router.homeMenuView());
            this.setBodyView(new HomeView());
        });
        app_router.on('route:defaultAction', function() {
            console.log("Router initialized");
            console.log("Facebook Login Check Here");
            Backbone.history.navigate('board', {trigger: true});
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