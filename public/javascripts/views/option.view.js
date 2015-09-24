define([
    'jquery',
    'underscore',
    'backbone',
    'magnific_popup',
    'text!templates/option.template.html'
], function($, _, Backbone, MagnificPopup, optionTemplate) {

    var OptionView = Backbone.View.extend({
        tagName: 'div',
        className: 'col-md-3 col-sm-4 col-xs-6',
        template: _.template(optionTemplate),

        events: {
            'click .link-vote': 'processVote'
        },

        render: function () {
            this.$el.html( this.template( this.model.toJSON() ) );

            this.$('.link-popup-image').magnificPopup({
                type: 'image'
            });

            this.$('[data-toggle="tooltip"]').tooltip();

            return this;
        },

        processVote: function (e) {
            var el = $(e.currentTarget);
            var voteCounted = this.model.get('voteCount');

            console.log(this.model.id);
            var self = this;

            // Vote Saving
            this.model.save({}, {
                patch: true,
                url: 'api/options/vote/' + this.model.id,
                success: function (model, response) {
                    console.log("Successfully Voted");
                    self.changeVote(el.data('voted'), el);
                },
                error: function (model, response) {
                    console.log("Error occurred in Voting");
                }
            });

            el.blur();
            e.preventDefault();
        },

        changeVote: function (voted, el) {
            if (voted !== true) {
                el.data('voted', true);
                el.css('color', '#df691a');
                el.attr('data-original-title', 'Already Voted').tooltip('fixTitle');
            } else {
                el.data('voted', false);
                el.css('color', '#bebebe');
                el.attr('data-original-title', 'Vote').tooltip('fixTitle');
            }
        }
    });

    return OptionView;

});