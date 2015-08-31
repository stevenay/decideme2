require.config({
    paths: {
        jquery: 'libs/jquery',
        backbone: 'libs/backbone-min',
        underscore: 'libs/underscore-min',
        templates: '../templates'
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
    console.log("initialized");

    // jquery to watch for 401 and 403 errors
    $.ajaxSetup({
        statusCode: {
            401: function(){
                // Redirec the to the login page.
                console.log("Hey 401 problem occurs here");

            },
            403: function() {
                // 403 -- Access denied
                console.log("Hey 403 problem occurs here");
            }
        }
    });

    App.initailize();
});