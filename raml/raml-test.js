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
            body: options.request.body || '',
            contentType: options.request.contentType || '',
            cookie: options.request.cookie || ''
        };

        this.response = {
            status: options.response.status || '',
            body: options.response.body
        };
    };

    /**
     * Runs all tests
     */
    RamlTest.prototype.getTest = function() {
        var self = this;

        return new Mocha.Test(self.name, function() {
            var response = null;
            describe(self.name, function () {
                before(function(done) {
                    var requestConfig = {};
                    if (self.request.method === "post" || self.request.method === "put"){
                        requestConfig = {
                            url: self.request.uri, //URL to hit
                            method: self.request.method, //Specify the method
                            headers: {
                                'Content-Type': self.request.contentType,
                                'Cookie': self.request.cookie
                            },
                            body: JSON.stringify(self.request.body)
                        }
                    } else {
                        requestConfig = {
                            url: self.request.uri, //URL to hit
                            headers: {
                                'Cookie': self.request.cookie
                            },
                            method: self.request.method //Specify the method
                        }
                    }
                    request(requestConfig, function (err, res, body) {
                        response = {
                            err: err,
                            res: res,
                            body: body
                        };
                        done();
                    });
                });

                it('should return response code ' + self.response.status, function (done) {
                    expect(parseInt(response.res.statusCode)).to.equal(parseInt(self.response.status));
                    done();
                });

                it('should return response header ' + self.response.body.name(), function (done) {
                    expect(response.res.headers['content-type']).to.have.string(self.response.body.name());
                    done();
                });

                it('should return correct response body (' + (self.response.body.type() || 'not defined') + ')', function (done) {
                    var validationResult = self.response.body.validateInstanceWithDetailedStatuses(JSON.parse(response.body));

                    if (validationResult.length === 0) {
                        done();
                    } else {
                        done(validationResult);
                    }
                });

            });
        });
    };
})();

module.exports = RamlTest;