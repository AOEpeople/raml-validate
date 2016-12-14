var fs = require('fs');
var path = require('path');

var parser = require('raml-1-parser');

var RamlInformation = null;

(function () {
    'use strict';

    /**
     * @param ramlFile
     * @constructor
     */
    RamlInformation = function (ramlFile) {
        if (typeof ramlFile !== 'undefined' && ramlFile !== '') {
            this.ramlFile = ramlFile;
        } else {
            throw new Error('Raml file is not set. Please provide a valid raml file path.');
        }

        this.api = parser.loadApiSync(path.resolve(this.ramlFile)).expand();
    };

    /**
     * This method return the (raml) type, which is defined for endpoint, method and responseCode
     * @param endpointUri
     * @param method
     * @param responseCode
     * @returns {null}
     */
    RamlInformation.prototype.getTypeObjectForEndpoint = function (endpointUri, method, responseCode) {

        var typeObject;

        this.api

            .allResources()

            .filter(function (resource) {
                return resource.completeRelativeUri() === endpointUri;
            })

            .some(function (resource) {

                return resource

                    .methods()

                    .filter(function (resourceMethod) {
                        return resourceMethod.method() === method;
                    })

                    .some(function (resourceMethods) {

                        typeObject = resourceMethods

                            .responses()

                            .filter(function (response) {
                                return response.code().value().toString() === responseCode.toString()
                            })
                    })

            });

        if (typeObject !== undefined && typeObject.length === 1) {

            return typeObject[0].body()[0];

        } else {

            return false;

        }
    };

    /**
     * This method returns the contentType of the request for the endpoint
     * @param endpointUri
     * @returns {null}
     */
    RamlInformation.prototype.getContentTypeForPostEndpoint = function (endpointUri) {

        var typeObject;
        var method = "post";

        this.api

            .allResources()

            .filter(function (resource) {
                return resource.completeRelativeUri() === endpointUri;
            })

            .some(function (resource) {

                return resource

                    .methods()

                    .filter(function (resourceMethod) {

                        return resourceMethod.method() === method;
                    })

                    .some(function (resourceMethods) {

                        typeObject = resourceMethods

                            .body()

                            .filter(function (body) {
                                return body.name().toString() !== undefined;
                            })
                    })

            });

        if (typeObject !== undefined && typeObject.length === 1) {

            return typeObject[0].name();

        } else {

            return false;

        }
    };
})();

module.exports = RamlInformation;