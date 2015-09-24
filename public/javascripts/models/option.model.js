define([
    'backbone'
], function (Backbone) {

    var Option = Backbone.Model.extend({
        idAttribute: "_id",

        defaults: {
            name: '',
            location: '',
            link: '',
            voteCount: 0,
            expiredDate: Date.now(),
            imageName: ''
        },

        urlRoot: '/api/options/',

        readFile: function(file) {
            var reader = new FileReader();
            // closure to capture the file information.
            reader.onload = ( function(theFile, that) {
                return function(e) {
                    that.set({filename: theFile.name, data: e.target.result});
                    that.set({imageUrl: theFile.name});
                    console.log(e.target.result);
                };
            })(file, this);

            // Read in the image file as a data URL.
            reader.readAsDataURL(file);
        },

        vote: function() {
            this.save();
        }
    });

    return Option;

});