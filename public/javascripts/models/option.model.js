define([
    'backbone'
], function (Backbone) {

    var Option = Backbone.Model.extend({
        defaults: {
            name: '',
            location: '',
            link: '',
            expiredDate: Date.now(),
            image: ''
        },

        readFile: function(file) {
            var reader = new FileReader();
            // closure to capture the file information.
            reader.onload = ( function(theFile, that) {
                return function(e) {
                    that.set({filename: theFile.name, data: e.target.result});
                };
            })(file, this);

            // Read in the image file as a data URL.
            reader.readAsDataURL(file);
        }
    });

    return Option;

});