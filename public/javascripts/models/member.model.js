define([
    'backbone'
], function (Backbone) {

    var Member = Backbone.Model.extend({
        defaults: {
            memberName: '',
            password: '',
            memberType: 'decideme',
            registerDate: Date.now()
        }
    });

    return Member;

});