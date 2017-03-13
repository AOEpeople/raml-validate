var Mocha = require('mocha');
var Filesystem = require('fs');
var RamlInformation = require('./raml-information');
var RamlTest = require('./raml-test');
var RamlTestRunner = null;

(function () {
    'use strict';

    /**
     * @param testConfigurationFile
     * @param ramlFile
     * @param server
     * @constructor
     */
    RamlTestRunner = function (testConfigurationFile, ramlFile, server, reportFile) {
        this.server = server;

        this.testConfig = JSON.parse(Filesystem.readFileSync(testConfigurationFile, 'utf8'));

        this.mochaInstance = new Mocha({
            'timeout': 5000
        });

        if (reportFile) {
            this.mochaInstance.reporter('mocha-junit-reporter', {
                mochaFile: './' + reportFile
            });
        }

        this.suiteInstance = Mocha.Suite.create(this.mochaInstance.suite, 'Test Suite');

        this.ramlInformation = new RamlInformation(ramlFile);

        this._createTestCases();
    };

    /**
     * Creates test cases from configuration
     */
    RamlTestRunner.prototype._createTestCases = function() {
        this.testConfig.forEach(function(configItem) {
            var responseType = this.ramlInformation.getTypeObjectForEndpoint(
                configItem.resource,
                configItem.request.method,
                configItem.response.status
            );

            if (responseType === false) {
                throw "Response Type for resource " + configItem.resource + " not found. Please check you validation config.";
            }

            var requestContentType = this.ramlInformation.getContentTypeForPostEndpoint(
                configItem.resource
            );


            var testCase = new RamlTest(configItem.name, {
                request: {
                    uri: this.server + configItem.request.path,
                    method: configItem.request.method,
                    body: configItem.request.body,
                    cookie: configItem.request.cookie,
                    contentType: requestContentType
                },
                response: {
                    status: configItem.response.status,
                    body: responseType
                }
            });

            this.suiteInstance.addTest(testCase.getTest());
        }.bind(this));
    };

    /**
     * execute all test cases
     */
    RamlTestRunner.prototype.run = function() {
        this.mochaInstance.addFile(__filename);

        this.mochaInstance.run(function(failures){
            process.on('exit', function () {
                process.exit(failures);
            });
        });
    };
})();

module.exports = RamlTestRunner;