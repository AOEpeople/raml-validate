var path 		= require('path');
var Mocha       = require('mocha');

var TestRunner = null;

(function () {
    'use strict';

    /**
     * @constructor
     */
    TestRunner = function () {
        this.mochaInstance = new Mocha({
            'timeout': 5000,
            reporter: 'mocha-junit-reporter',
            reporterOptions: {
                mochaFile: './report.xml'
            }
        });
        this.suiteInstance = Mocha.Suite.create(this.mochaInstance.suite, 'Test Suite');
    };

    /**
     * add test to suite
     * @param ramlTest
     */
    TestRunner.prototype.addTest = function(ramlTest) {
        this.suiteInstance.addTest(ramlTest.getTest());
    };

    /**
     * running all tests
     */
    TestRunner.prototype.runTests = function() {
        this.mochaInstance.addFile(__filename);
        this.mochaInstance.run(function(failures){
            process.on('exit', function () {
                process.exit(failures);
            });
        });
    };
})();

module.exports = TestRunner;