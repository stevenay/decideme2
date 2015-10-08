define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/card.template.html'
], function($, _, Backbone, cardTemplate) {

    var OptionRowObj = function OptionRow (contr) {

        var container = contr || $('<div></div>'),
            needNewRow = true,
            optionsCount = 0,
            needNewRow = true;

        this.tagElement = '<div class="row"></div>';
        this.optionRow = null;
        this.optionsCount = 0;

        this.getOptionRow = function () {
            this.optionsCount++;

            if (needNewRow === true) {
                this.optionRow = $(this.tagElement).appendTo(container);
                needNewRow = false;
            }

            if (this.optionsCount == 4) {
                needNewRow = true;
                this.optionsCount = 0;
            }

            return this.optionRow;
        }
    };

    return OptionRowObj;

});