define([
    'jquery',
    'underscore',
    'backbone',
    'magnific_popup',
    'eventbus',
    'text!templates/option.template.html',
    'text!templates/option.winnerLink.template.html'
], function($, _, Backbone, MagnificPopup, EventBus, optionTemplate, winnerLinkTemplate) {
    var OptionView = Backbone.View.extend({
        tagName: 'div',
        className: 'option',
        template: _.template(optionTemplate),

        initialize: function (options) {
            this.options = options || {};
            this.listenTo(this.model, 'change:voted', this.changeVoteState);
            this.listenTo(this.model, 'change:voteCount', this.changeVoteCount);
            this.listenTo(this.model, 'change:alreadySelectedOption', this.changeSelectedOption);
            this.listenTo(this.model, 'change:status', this.changeOptionStatus);
        },

        events: {
            'click .link-vote': 'processVote',
            'click #link-edit': 'editOption',
            'click #link-winner': 'markWinOption'
        },

        renderInfo: function (model) {
            this.$('#span-name').html(model.get('name'));
            this.$('#span-location').html(model.get('location'));
            this.$('#span-link').html(model.get('link'));

            if (_.contains(_.keys(model.changed), "imageName"))
                this.$('#block-card-img-holder').css("background-image", "url(images/options/" + model.get("imageName") + ")");
        },

        render: function () {
            //console.log(_.defaults(this.model.toJSON(), {alreadySelectedOption: this.options.alreadySelectedOption}));
            this.$el.html( this.template( this.model.toJSON() ) );
            this.$linkVote = this.$(".link-vote");
            this.$voteCount = this.$("#block-vote-count");
            this.$spanWinner = this.$('#span-winner');

            if (this.model.get('voters').length > 0) {
                var indexOfMember = this.model.get('voters').indexOf(this.options.memberId);
                if (indexOfMember > -1)
                    this.model.set('voted', true);
            }

            this.listenTo(this.model, 'change', function(model) {
                if (_.isEmpty(_.intersection(_.keys(model.changed), ["voteCount", "voted", "status", "alreadySelectedOption"]))) {
                    this.renderInfo.apply(this, arguments);
                }
            });

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

        editOption: function (e) {
            e.preventDefault();
            EventBus.trigger('option:edit', this.model);
        },

        markWinOption: function (e) {
            e.preventDefault();
            var status = (this.model.get('status') === 'selected') ? '' : 'selected';
            var self = this;
            this.model.save({ status: status }, {
                patch: true,
                success: function(model, response) {
                    console.log(response);
                    self.model.set({ alreadySelectedOption: (response.selectedOption != null) });
                }
            });
        },

        // Helper Functions
        changeVoteState: function (option, voted) {
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
        },
        changeSelectedOption: function (option, selectedOption) {
            var status = option.get('status');
            if (selectedOption && status === "") {
                this.$spanWinner.hide();
            } else if (!selectedOption) {
                this.$spanWinner.show();
            } else if (selectedOption && status === "selected") {
                this.$spanWinner.show();
                this.$spanWinner.find('.glyphicon').css('color','#df691a');
            }
        },
        changeOptionStatus: function (option, status) {
            if (status === "") this.$spanWinner.find('.glyphicon').removeAttr('style');
        }
    });

    return OptionView;

});