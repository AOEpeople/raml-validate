var parser 		= require('raml-1-parser');
var fs 			= require('fs');
var path 		= require('path');

var RamlTest    = require('./raml-test.js');

var RamlTestGenerator = null;

(function () {
    'use strict';

    RamlTestGenerator = function (ramlFile, serverUri) {
        if (typeof ramlFile !== 'undefined' && ramlFile !== '') {
            this.ramlFile = ramlFile;
        } else {
            throw new Error('Raml file is not set. Please provide a valid raml file path.');
        }

        if (typeof serverUri !== 'undefined' && serverUri !== '') {
            this.serverUri = serverUri;
        } else {
            throw new Error('serverUri is not set. Please provide a valid serverUri.');
        }

        this.api = parser.loadRAMLSync(path.resolve(this.ramlFile));
    };

    RamlTestGenerator.prototype.getAllTests = function(config) {
        var self  = this;
        var ramlTests = [];
        var ramlConfiguration = config;

        this.api.allResources().forEach(function (resource) {
            var relativeUri = resource.completeRelativeUri();

            var placeholderMatches = relativeUri.match(/{(.*?)}/g);

            if (placeholderMatches !== null) {
                placeholderMatches.forEach(function(placeholder) {
                    var placeHolderValue = ramlConfiguration.getPlaceholderValue(relativeUri, placeholder, path.basename(self.ramlFile));
                    if (placeHolderValue !== null) {
                        relativeUri = relativeUri.replace(placeholder, placeHolderValue)
                    }
                });
            }

            resource.methods().forEach(function(method) {
                var requestMethod = method.method();

                method.responses().forEach(function(response) {
                    var expectedResponseCode = response.code().value();
                    var expectedResponseBody = response.body()[0];

                    var ramlTest = new RamlTest(relativeUri + ' Test', {
                        request: {
                            uri: self.serverUri + relativeUri,
                            method: requestMethod
                        },
                        response: {
                            status: parseInt(expectedResponseCode),
                            body: expectedResponseBody
                        }
                    });

                    ramlTests.push(ramlTest);
                });
            });
        });

        return ramlTests;
    };

})();

module.exports = RamlTestGenerator;