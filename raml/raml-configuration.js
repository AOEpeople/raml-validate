var fs = require('fs');

var RamlConfiguration = null;

(function () {
    'use strict';

    /**
     * @param path
     * @constructor
     */
    RamlConfiguration = function (path) {
        if (typeof path !== 'undefined' && path !== '') {
            this.config = JSON.parse(fs.readFileSync(path, 'utf8'));
        } else {
            throw new Error('Test name is not set. Please provide a valid test name.');
        }
    };

    /**
     * return a configured placeholder value for uri
     * @param uri
     * @param placeholder
     * @returns {*}
     */
    RamlConfiguration.prototype.getPlaceholderValue = function(uri, placeholder, ramlFileName) {
        var placeholderValue = placeholder;
        this.config.forEach(function(configEntry) {
            if (configEntry.uri === uri && configEntry.filename === ramlFileName) {
                placeholderValue = configEntry['placeholder'][placeholder];
            }
        });

        return placeholderValue;
    };
})();

module.exports = RamlConfiguration;