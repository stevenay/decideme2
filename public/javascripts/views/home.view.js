define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/home.template.html'
], function($, _, Backbone, homeTemplate){

    var HomeView = Backbone.View.extend({
        //tagName: $('#landingPage'),

        events: {
            "click #btn-login": 'logIn'
        },

        render: function() {
            console.log("Yeah, it rendered");
            this.$el.html(homeTemplate);
        },

        logIn: function(e) {
            e.preventDefault();

            var that = this;
            var url = '/api/members/login';
            console.log('Loggin in... ');
            var formValues = {
                email: $('#input-email').val(),
                password: $('#input-password').val()
            };

            $.ajax({
                url:url,
                type:'POST',
                data: formValues,
                timeout: 5000,
                success: function (data, textStatus, xhr) {
                    console.log(["Login request details: ", data]);

                    if(data.error) {  // If there is an error, show the error messages
                        console.log(data.error.text);
                    }

                    if (xhr.status == 200) {
                        if (data.status == 'login_failed') {
                            console.log("Email and Password do not match.");
                        } else if (data.status == 'login_success') {
                            that.$el.find('#login-modal').modal('hide')
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
        }
    });

    return HomeView;

});