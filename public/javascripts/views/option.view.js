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

        initialize: function (options) {
            this.options = options || {};
            this.listenTo(this.model, 'change:voted', this.changeVoteState);
            this.listenTo(this.model, 'change:voteCount', this.changeVoteCount);
        },

        events: {
            'click .link-vote': 'processVote'
        },

        render: function () {
            this.$el.html( this.template( this.model.toJSON() ) );
            this.$linkVote = this.$(".link-vote");
            this.$voteCount = this.$("#block-vote-count");

            if (this.model.get('voters').length > 0) {
                var indexOfMember = this.model.get('voters').indexOf(this.options.memberId);
                if (indexOfMember > -1)
                    this.model.set('voted', true);
            }

            this.$('.link-popup-image').magnificPopup({ type: 'image' });
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
                url: 'api/options/vote/' + this.model.id
            });

            el.blur();
            e.preventDefault();
        },

        changeVoteState: function (option, voted) {
            console.log(this.$linkVote);
            console.log(voted);
            if (voted === true) {
                this.$linkVote.data('voted', true);
                this.$linkVote.css('color', '#df691a');
                this.$linkVote.attr('data-original-title', 'Already Voted').tooltip('fixTitle');
            } else {
                this.$linkVote.data('voted', false);
                this.$linkVote.css('color', '#bebebe');
                this.$linkVote.attr('data-original-title', 'Vote').tooltip('fixTitle');
            }
        },

        changeVoteCount: function (option, voteCount) {
            this.$voteCount.html(voteCount);
        }
    });

    return OptionView;

});