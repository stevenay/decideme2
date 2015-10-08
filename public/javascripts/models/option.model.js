define([
    'backbone',
    'moment'
], function (Backbone, Moment) {

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
            status: '',
            voted: false,
            alreadySelectedOption: false
        },

        attrBlacklist: ['voted'],

        urlRoot: '/api/options/',

        parse: function (data) {
            if (data.expiredDate != null)
                data.expiredDate = Moment(data.expiredDate).format("YYYY-MM-DD");
            return data
        },

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
                blackListed =  _.omit(attrs, this.attrBlacklist);
            else
                blackListed = attrs;

            options.contentType = "application/json";
            options.data = JSON.stringify(blackListed);

            // Proxy the call to the original save function
            return Backbone.Model.prototype.save.call(this, attrs, options);
        }
    });

    return Option;

});