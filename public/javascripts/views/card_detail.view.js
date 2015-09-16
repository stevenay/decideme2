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
            'change #input-upload-image': 'handleUploadFile',
            'click #button-add-option': 'addOption'
        },

        render: function () {
            this.$el.html( this.template( this.model.toJSON() ) );

            this.$uploadImageHolder = this.$('#block-image-holder');
            this.$form = this.$('#form-add-option');
            this.$buttonUploadImage = this.$('#button-upload-image');
            this.$fileInput = this.$('#input-upload-image');

            this.$imageTesting = this.$('#image-testing');
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
            if ( !window.FileReader ) return;
            if (files && files[0]) {
                console.log("hello");
                if ( /^image/.test( files[0].type ) ) {
                    this.readURL(files[0]);
                    this.imageFile = files[0];
                    this.$buttonUploadImage.text('Change an Image');
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

                that.imageFileData = this.result;
                that.imageFileName = file.name;
            }
            reader.readAsDataURL(file);
        },

        getFileExt: function(rawFileName) {
            var ext = null;
            if(rawFileName != null){
                var filename = rawFileName.replace(/\\/g, '/').replace(/.*\//, '');
                ext = filename.replace(/^.*\./, '').toLowerCase();
            }
            return ext;
        },

        addOption: function (e) {
            e.preventDefault();
            var formData = {};
            var multipartData = new FormData();

            this.$form.find( 'input' ).each( function( i, el ) {
                var $el = $(el);
                if ( $el.val() != '' && $el.data('fieldname') != null ) {
                    // el.id is the Javascript code
                    formData[ $el.data('fieldname') ] = $el.val();
                    //multipartData.append($el.data('fieldname'), $el.val());
                }

                $el.val('');
            });

            if (this.imageFileData) {
                console.log("Reach here1");
                var fileName = $.now() + '.' + this.getFileExt(this.imageFileName);
                formData.imageName = fileName;
                //multipartData.append('imageName', fileName);
                multipartData.append('file', this.imageFile);
            }

            $.ajax({
                url: 'api/options/'+this.model.get('imageName'),
                data: multipartData,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data) {
                    console.log(data);
                    var option = new OptionModel(data);
                },
                error: function(data) {
                    alert('no upload');
                }
            });

            //option.save(null, {
            //    wait: true,
            //    error: function(model, response) {
            //        console.log(model);
            //        console.log(response);
            //        console.log(formData.data);
            //        console.log(that.$imageTesting.html());
            //        that.$imageTesting.css("background-image", "url(" + formData.data + ")");
            //    },
            //    success: function(model, response) {
            //        //mocksCollection.add(model);
            //        console.log(model, response);
            //        $('#image-testing').attr("src", option.imageFileData);
            //    }
            //});
        }

    });

    return CardView;

});