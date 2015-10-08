define([
    'jquery',
    'underscore',
    'backbone',
    'magnific_popup',
    'models/option.model',
    'views/option.view',
    'views/option_row.component',
    'eventbus',
    'text!templates/card_detail.template.html',
    'text!templates/card_alert.template.html',
    'async!https://maps.googleapis.com/maps/api/js?key=AIzaSyA0_gygQCs6t9W_K_yFbOs2MuphsPYEqfw&signed_in=true&libraries=places&callback=initAutocomplete'
], function($, _, Backbone, MagnificPopup, OptionModel, OptionView, OptionRow, EventBus, cardDetailTemplate, alertTemplate) {

    var CardView = Backbone.View.extend({
        tagName: 'div',
        className: 'container',
        template: _.template(cardDetailTemplate),
        alertTemplate: _.template(alertTemplate),

        initialize: function (options) {
            this.options = options || {};
            this.model.optionCollection.fetch({ reset: true });
            this.listenTo( this.model.optionCollection, 'add', this.renderOption );
            this.listenTo( this.model.optionCollection, 'reset', this.renderAllOptions );
            this.listenTo( this.model, 'change:status', this.setCardStatus );
            this.listenTo( EventBus, "option:edit", this.setFormData );

            this.childViews = [];
            var map;
            var autocomplete;
        },

        events: {
            'click #btn-participants': 'showParticipantsModal',
            'click #button-new-option': 'showNewOptionModal',
            'click #button-upload-image': 'showImageUploadDialog',
            'change #input-upload-image': 'handleUploadFile',
            'click #button-add-option': 'manipulateOption',
            'click #button-cancel-option': 'cancelNewOptionModal',
            'focus #input-location': 'geolocate',
            'hidden.bs.modal #option-new-modal': 'formCleanUp'
        },

        render: function () {
            this.$el.html( this.template( this.model.toJSON() ) );

            this.$uploadImageHolder = this.$('#block-image-holder');
            this.$form = this.$('#form-add-option');
            this.$buttonUploadImage = this.$('#button-upload-image');
            this.$fileInput = this.$('#input-upload-image');

            this.$imageTesting = this.$('#image-testing');
            this.$optionsBoard = this.$('div#optionsBoard');
            this.optionRow = new OptionRow( this.$optionsBoard );

            this.setCardStatus(this.model, this.model.get('status'));
            this.initAutocomplete();
            return this;
        },
        onClose: function () {
            this.destroyAllOptions();
        },

        renderAllOptions: function() {
            //var selectedOption = this.model.optionCollection.findWhere({ status: 'selected' });
            var alreadySelOp = (this.model.get('selectedOption') != null) ? true : false;
            this.model.optionCollection.each( function (option, iterator) {
                option.set({ alreadySelectedOption: alreadySelOp });
                this.renderOption(option, true);
            }, this );

            this.listenTo( this.model.optionCollection, 'change:alreadySelectedOption', this.setSelectedOption );
        },
        renderOption: function(option, addFromCollection, alreadySelOp) {
            var optionView = new OptionView({
                model: option,
                memberId: this.options.memberId });
            //this.optionRow.getOptionRow().append( optionView.render().el );
            this.$optionsBoard.append( optionView.render().el );
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
        setSelectedOption: function(changedOption, alreadySelectedOption) {
            console.log("I'm changed too");
            this.model.optionCollection.invoke('set', { "alreadySelectedOption": alreadySelectedOption });
        },

        showParticipantsModal: function () {
            $('#participants-modal').modal('toggle');
            e.preventDefault();
        },
        showNewOptionModal: function (e) {
            $('#option-new-modal').modal('toggle');

            if (e != null)
                e.preventDefault();
        },
        cancelNewOptionModal: function (e) {
            $('#option-new-modal').modal('toggle');
        },
        showImageUploadDialog: function (e) {
            this.$fileInput.click();
            e.preventDefault();
        },

        formCleanUp: function () {
            this.$form.find('input').each( function(i,el) {
                var $el = $(el);
                $el.val('');
            });

            this.$('#button-add-option').html('Create');
            this.$uploadImageHolder.removeClass('upload-image-holder');
            this.$uploadImageHolder.css("background-image", "");
            this.$buttonUploadImage.text('Upload an Image');
        },
        setFormData: function (optionModel) {
            this.$form.find('input').each ( function(i,el) {
                var $el = $(el);
                $el.val(optionModel.get($el.data('fieldname')));
            });

            this.$form.find('input[type="hidden"]').val(optionModel.id);

            if (optionModel.get('imageName') != '') {
                this.$buttonUploadImage.text('Change an Image');
                this.readPath('../../images/options/' + optionModel.get('imageName'));
            }

            this.$('#button-add-option').html('Update');
            this.showNewOptionModal();
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
        readPath: function (path) {
            this.$uploadImageHolder.html("&nbsp;");
            this.$uploadImageHolder.addClass('upload-image-holder');
            this.$uploadImageHolder.css("background-image", "url(" + path + ")");
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

        // Google Location AutoComplte
        initAutocomplete: function () {
            // Create the autocomplete object, restricting the search to geographical
            // location types.
            autocomplete = new google.maps.places.Autocomplete(
                /** @type {!HTMLInputElement} */(this.$('#input-location')[0]),
                {types: ['geocode']});

        },
        geolocate: function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var geolocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    var circle = new google.maps.Circle({
                        center: geolocation,
                        radius: position.coords.accuracy
                    });
                    autocomplete.setBounds(circle.getBounds());
                });
            }
        },

        manipulateOption: function (e) {
            var buttonText = $(e.currentTarget).html();
            switch(buttonText.toLowerCase()) {
                case "create":
                    this.addOption();
                    break;
                case "update":
                    this.updateOption();
                    break;
                default:
                    break;
            }
            e.preventDefault();

        },
        updateOption: function () {
            var multipartData = new FormData();

            this.$form.find( 'input' ).each( function( i, el ) {
                var $el = $(el);
                if ( $el.val() != '' && $el.data('fieldname') != null ) {
                    multipartData.append($el.data('fieldname'), $el.val());
                }
            });

            modifyId = this.$form.find('input[type=hidden]').val();

            if (this.imageFile) {
                multipartData.append('file', this.imageFile);
            }
            multipartData.append('cardId', this.model.id);

            var self = this;
            $.ajax({
                url: 'api/options/' + modifyId,
                data: multipartData,
                cache: false,
                contentType: false,
                processData: false,
                type: 'PUT',
                success: function(data) {
                    var modifyModel = self.model.optionCollection.get(modifyId);

                    modifyModel.set({
                        expiredDate: data.expiredDate,
                        imageName: data.imageName,
                        link: data.link,
                        location: data.location,
                        name: data.name,
                        updated_at: data.updated_at
                    });

                    self.model.optionCollection.set([modifyModel], { remove: false });

                    // clean up process
                    self.imageFile = null;
                    self.cancelNewOptionModal();
                },
                error: function(data) {
                    alert('no upload');
                }
            });
        },
        addOption: function () {
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
                url: 'api/options/',
                data: multipartData,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data) {
                    self.model.optionCollection.add({
                        id: data._id,
                        card: data.card,
                        created_at: data.created_at,
                        expiredDate: data.expiredDate,
                        imageName: data.imageName,
                        link: data.link,
                        location: data.location,
                        name: data.name,
                        updated_at: data.updated_at
                    });

                    if (data.cardStatus != null)
                        self.model.set('status', data.cardStatus);

                    // clean up process
                    self.imageFile = null;
                    self.cancelNewOptionModal();
                },
                error: function(data) {
                    console.log(data);
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
        },

        changeStatus: function (card, changedStatus) {
            this.$('#span-cardStatus').html(changedStatus);
        },
        setCardStatus: function (card, changedStatus) {
            this.$('#span-cardStatus').html(changedStatus);
            if (changedStatus == 'preparing')
                this.$('#span-cardStatusAlert').html(this.alertTemplate);
            else
                this.$('#span-cardStatusAlert').html('');
        }
    });

    return CardView;

});