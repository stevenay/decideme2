require.config({
    paths: {
        jquery: 'libs/jquery',
        backbone: 'libs/backbone-min',
        underscore: 'libs/underscore-min',
        templates: '../templates',
        cookie: 'libs/js.cookie'
    },
    shim: {
        'libs/underscore/underscore': {
            exports: '_'
        },
        'libs/backbone/backbone': {
            deps: ['lib/underscore', 'jquery'],
            exports: 'Backbone'
        }
    }
});

require([
    'app'
], function (App) {
    // All the initialization code here
    Backbone.View.prototype.close = function(){
        // COMPLETELY UNBIND THE VIEW
        this.undelegateEvents();

        this.$el.removeData().unbind();

        // Remove view from DOM
        this.remove();
        Backbone.View.prototype.remove.call(this);

        if (this.onClose){
            this.onClose();
        }
    }

    Backbone.View.prototype.show = function(willRender) {
        if (willRender === true)
            this.render();

        if (this.onShow) {
            this.onShow();
        }

        return this;
    }

    // Backbone Router Extension
    Backbone.Router.prototype.before = function () {};
    Backbone.Router.prototype.after = function () {};
    Backbone.Router.prototype.beforeExceptRoutes = [];

    Backbone.Router.prototype.route = function (route, name, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback) callback = this[name];

        var router = this;

        Backbone.history.route(route, function(fragment) {
            var args = router._extractParameters(route, fragment);

            var next = function(){
                callback && callback.apply(router, args);
                router.trigger.apply(router, ['route:' + name].concat(args));
                router.trigger('route', name, args);
                Backbone.history.trigger('route', router, name, args);
                router.after.apply(router, args);
            }
            router.before.apply(router, [args, next]);
        });
        return this;
    };

    // jquery to watch for 401 and 403 errors
    //$.ajaxSetup({
    //    statusCode: {
    //        401: function(){
    //            // Redirec the to the login page.
    //            console.log("Hey 401 problem occurs here");
    //
    //        },
    //        403: function() {
    //            // 403 -- Access denied
    //            console.log("Hey 403 problem occurs here");
    //        }
    //    }
    //});

    App.initailize();
});