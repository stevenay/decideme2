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
            voters: [],
            imageName: '',
            voted: false
        },

        attrBlacklist: ['voted'],

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

        // Overwrite save function
        save: function(attrs, options) {
            options || (options = {});
            attrs || (attrs = _.clone(this.attributes));

            if (this.attrBlacklist != null )
                blackListed =  _.omit(this.attributes, this.attrBlacklist);
            else
                blackListed = this.attributes;

            options.data = JSON.stringify(blackListed);

            // Proxy the call to the original save function
            return Backbone.Model.prototype.save.call(this, attrs, options);
        }
    });

    return Option;

});