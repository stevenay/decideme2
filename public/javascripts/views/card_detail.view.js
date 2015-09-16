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
                refObj.$uploadImageHolder.append("<h4>Not supported image format.</h4>");
                refObj.$buttonUploadImage.text('Upload an Image');
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

                if (this.imageFile) {
                    console.log("Reach here1");
                    var fileName = $.now() + '.' + this.getFileExt(this.imageFile.name);
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