define([
    'jquery',
    'underscore',
    'backbone',
    'models/option.model',
    'text!templates/card_detail.template.html'
], function($, _, Backbone, OptionModel, cardDetailTemplate) {

    var CardView = Backbone.View.extend({
        tagName: 'div',
        className: 'container',
        template: _.template(cardDetailTemplate),

        events: {
            'click #btn-participants': 'showParticipantsModal',
            'click #button-new-option': 'showNewOptionModal',
            'click #button-upload-image': 'showImageUploadDialog',
            'change #input-upload-image': 'handleUploadFile'
        },

        render: function () {
            this.$el.html( this.template( this.model.toJSON() ) );

            this.$uploadImageHolder = this.$('#block-image-holder');

            console.log(this.$uploadImageHolder);

            this.$buttonUploadImage = this.$('#button-upload-image');
            this.$fileInput = this.$('#input-upload-image');
            return this;
        },

        showParticipantsModal: function () {
            $('#participants-modal').modal('toggle');
            e.preventDefault();
        },

        showNewOptionModal: function (e) {
            $('#option-new-modal').modal('toggle');
            e.preventDefault();
        },

        showImageUploadDialog: function (e) {
            this.$fileInput.click();
            e.preventDefault();
        },

        handleUploadFile: function (e) {
            var files = e.currentTarget.files;
            console.log(files);
            if ( !window.FileReader ) return;
            if (files && files[0]) {
                console.log("hello");
                if ( /^image/.test( files[0].type ) ) {
                    this.readURL(files[0]);
                    this.$buttonUploadImage.text('Change an Image');

                    // set uploaded image
                    this.imageFile = file;
                } else {
                    this.$uploadImageHolder.removeClass('upload-image-holder');
                    this.uploadImageHolder.css("background-image", "");
                    this.$buttonUploadImage.text('Create an Image');
                }
            }
        },

        readURL: function (file) {
            var reader = new FileReader();
            var that = this;
            reader.onloadend = function (e) {
                that.$uploadImageHolder.addClass('upload-image-holder');
                that.$uploadImageHolder.css("background-image", "url(" + this.result + ")");
            }
            reader.readAsDataURL(file);
        },

        addOption: function (e) {
            e.preventDefault();
            var formData = {};
            this.$form.find( 'input' ).each( function( i, el ) {
                if ( $(el).val() != '' ) {
                    // el.id is the Javascript code
                    formData[ el.id ] = $(el).val();
                }

                $(el).val('');
            });
            var option = new OptionModel(formData);
            if (this.imageFile) option.readFile(this.imageFile);

            option.save(null, {
                wait: true,
                error: function(model, response) {
                    console.log(model)
                },
                success: function(model, response) {
                    //mocksCollection.add(model);
                    console.log(model, response);
                }
            });
        }

    });

    return CardView;

});