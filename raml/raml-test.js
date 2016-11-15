var request     = require('request');
var expect      = require('chai').expect;
var Mocha       = require('mocha');

var RamlTest = null;

require('mocha');

(function () {
    'use strict';

    RamlTest = function (name, options) {
        if (typeof name !== 'undefined' && name !== '') {
            this.name = name;
        } else {
            throw new Error('Test name is not set. Please provide a valid test name.');
        }

        this.applyOption(options);
    };

    /**
     * Applies all option params
     * @param options
     */
    RamlTest.prototype.applyOption = function (options) {
        this.request = {
            uri: options.request.uri || '',
            method: options.request.method || '',
            params: options.request.params || {},
            query: options.request.query || {},
            body: options.request.body || ''
        };

        this.response = {
            status: options.response.status || '',
            type: options.response.type || '',
            body: options.response.body || ''
        };
    };

    /**
     * Runs all tests
     */
    RamlTest.prototype.getTest = function() {
        var ramlTestScope = this;

        return new Mocha.Test(ramlTestScope.name, function() {
            describe(ramlTestScope.name, function() {

                it('should return response code ' + ramlTestScope.response.status, function (done) {
                    request.get(ramlTestScope.request.uri, function (err, res, body) {
                        expect(parseInt(res.statusCode)).to.equal(parseInt(ramlTestScope.response.status));
                        done();
                    });
                });

                it('should return response header ' + ramlTestScope.response.body.name(), function (done) {
                    request.get(ramlTestScope.request.uri, function (err, res, body) {
                        expect(res.headers['content-type']).to.have.string(ramlTestScope.response.body.name());
                        done();
                    });
                });

                it('should return correct response body (' + ramlTestScope.response.body.type() + ')', function (done) {
                    request.get(ramlTestScope.request.uri, function (err, res, body) {
                        var validationResult = ramlTestScope.response.body.validateInstance(JSON.parse(body));
                        if (validationResult.length === 0) {
                            done();
                        } else {
                            done(validationResult);
                        }
                    });
                });

            });
        });
    };
})();

module.exports = RamlTest;