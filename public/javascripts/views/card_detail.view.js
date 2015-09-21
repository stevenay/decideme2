define([
    'jquery',
    'underscore',
    'backbone',
    'magnific_popup',
    'models/option.model',
    'views/option.view',
    'text!templates/card_detail.template.html'
], function($, _, Backbone, MagnificPopup, OptionModel, OptionView, cardDetailTemplate) {

    var CardView = Backbone.View.extend({
        tagName: 'div',
        className: 'container',
        template: _.template(cardDetailTemplate),

        initialize: function () {
            this.model.optionCollection.fetch({ reset: true });

            this.listenTo( this.model.optionCollection, 'add', this.renderOption );
            this.listenTo( this.model.optionCollection, 'reset', this.renderAllOptions );

            this.childViews = [];
        },

        events: {
            'click #btn-participants': 'showParticipantsModal',
            'click #button-new-option': 'showNewOptionModal',
            'click #button-upload-image': 'showImageUploadDialog',
            'change #input-upload-image': 'handleUploadFile',
            'click #button-add-option': 'addOption',
            'click #button-cancel-option': 'cancelNewOptionModal',
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

        onClose: function () {
            this.destroyAllOptions();
        },

        renderAllOptions: function() {
            this.model.optionCollection.each( function (option) {
                this.renderOption(option, true);
            }, this );
        },
        renderOption: function(option, addFromCollection) {
            var optionView = new OptionView({ model: option });
            this.$el.find('div#optionsBoard').append( optionView.render().el );

            this.childViews.push(optionView);
        },
        destroyAllOptions: function() {
            if (this.childViews.length) {
                _.each(this.childViews, function (obj) {
                    obj.close();
                }, this);
            }

            this.childViews.length = 0;
        },

        showParticipantsModal: function () {
            $('#participants-modal').modal('toggle');
            e.preventDefault();
        },
        showNewOptionModal: function (e) {
            $('#option-new-modal').modal('toggle');
            e.preventDefault();
        },
        cancelNewOptionModal: function (e) {
            this.formCleanUp();
            $('#option-new-modal').modal('toggle');
        },
        showImageUploadDialog: function (e) {
            this.$fileInput.click();
            e.preventDefault();
        },

        handleUploadFile: function (e) {
            if ( !window.FileReader ) alert("Please upgrade your browser to upload images!!!");

            var files = e.currentTarget.files;

            if (files && files[0]) {
                var file = files[0];

                // Check File Size
                if (file.size >= 4 * 1024 * 1024) {
                    alert("File size must be at most 4MB");
                    return;
                }

                this.checkBLOBFileHeader(escape(file.name), file, this.printImage);
            }
        },
        printImage: function (header, file, refObj) {
            console.log(header);
            console.log(refObj.mimeType(header));
            if (refObj.mimeType(header) !== 'unknown') {
                refObj.readURL(file);
                refObj.imageFile = file;
                refObj.$buttonUploadImage.text('Change an Image');
            } else {
                refObj.$uploadImageHolder.removeClass('upload-image-holder');
                refObj.$uploadImageHolder.css("background-image", "");
                refObj.$buttonUploadImage.text('Upload an Image');
                refObj.$uploadImageHolder.append("<h4>Not supported image format.</h4>");
            }
        },
        readURL: function (file) {
            var reader = new FileReader();
            var that = this;
            reader.onloadend = function (e) {
                that.$uploadImageHolder.html("&nbsp;");
                that.$uploadImageHolder.addClass('upload-image-holder');
                that.$uploadImageHolder.css("background-image", "url(" + this.result + ")");
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
        // Return the first few bytes of the file as a hex string
        checkBLOBFileHeader: function (fileName, file, callback) {
            var that = this;
            var fileReader = new FileReader();
            fileReader.onloadend = function(e) {
                var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                var header = "";
                for (var i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }
                callback(header, file, that);
            };
            fileReader.readAsArrayBuffer(file);
        },
        // Add more from http://en.wikipedia.org/wiki/List_of_file_signatures
        mimeType: function (headerString) {
            switch (headerString) {
                case "89504e47":
                    type = "image/png";
                    break;
                case "47494638":
                    type = "image/gif";
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                    type = "image/jpeg";
                    break;
                default:
                    type = "unknown";
                    break;
            }
            return type;
        },

        formCleanUp: function () {
            this.$form.find('input').each( function(i,el) {
                var $el = $(el);
                $el.val('');
            });

            this.$uploadImageHolder.removeClass('upload-image-holder');
            this.$uploadImageHolder.css("background-image", "");
            this.$buttonUploadImage.text('Upload an Image');
        },

        addOption: function (e) {
            e.preventDefault();
            var multipartData = new FormData();

            this.$form.find( 'input' ).each( function( i, el ) {
                var $el = $(el);
                if ( $el.val() != '' && $el.data('fieldname') != null ) {
                    multipartData.append($el.data('fieldname'), $el.val());
                }
            });
            if (this.imageFile) {
                multipartData.append('file', this.imageFile);
            }
            multipartData.append('cardId', this.model.id);

            var self = this;
            $.ajax({
                url: 'api/options/'+this.model.get('imageName'),
                data: multipartData,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data) {
                    self.model.optionCollection.add({
                        _id: data._id,
                        card: data.card,
                        created_at: data.created_at,
                        expiredDate: data.expiredDate,
                        imageName: data.imageName,
                        link: data.link,
                        location: data.location,
                        name: data.name,
                        updated_at: data.updated_at
                    });

                    // clean up process
                    self.imageFile = null;
                    self.formCleanUp();
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