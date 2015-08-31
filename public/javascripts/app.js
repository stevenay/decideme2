define([
    'jquery',
    'underscore',
    'backbone',
    'router',
    'views/home.view'
], function($, _, Backbone, Router, HomeView) {
    var initialize = function () {
        Router.initialize();
    };

    return {
        initailize: initialize
    }
});