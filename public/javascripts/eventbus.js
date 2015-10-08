define([
    'underscore',
    'backbone'
], function(_, Backbone){
    var EventBus = {
    };
    _.extend(EventBus, Backbone.Events);
    return EventBus;
});