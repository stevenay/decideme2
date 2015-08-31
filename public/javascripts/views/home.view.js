define([
    'jquery',
    'underscore',
    'backbone',
    'views/menu/homemenu.view',
    'text!templates/home.template.html'
], function($, _, Backbone, HomeMenuView, homeTemplate){

    var HomeView = Backbone.View.extend({
        el: $('#page'),

        events: {
            "click #btnLogIn": 'logIn'
        },

        render: function() {
            var homeMenuView = new HomeMenuView();
            homeMenuView.render();

            this.$el.html(homeTemplate);
        },

        renderMemberHome: function() {
            //var homeMenuView = new HomeMenuView();
            //homeMenuView.render();
        },

        logIn: function(e) {
            e.preventDefault();

            var that = this;
            var url = '/api/members/login';
            console.log('Loggin in... ');
            var formValues = {
                email: $('#inputEmail').val(),
                password: $('#inputPassword').val()
            };

            $.ajax({
                url:url,
                type:'POST',
                data: formValues,
                success:function (data, textStatus, xhr) {
                    console.log(["Login request details: ", data]);

                    if(data.error) {  // If there is an error, show the error messages
                        console.log(data.error.text);
                    }

                    if (xhr.status == 200) {
                        that.$el.find('#login-modal').modal('hide')
                        Backbone.history.navigate('board', {trigger: true});
                    }
                    else if (xhr.status == 401)
                        console.log("Email and Password do not match.")
                }
            });
        }
    });

    return HomeView;

});