/* validate commander component
 * To use add require('../cmds/validate.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

var testGenerator 		= require('../raml/raml-test-generator');
var testConfiguration   = require('../raml/raml-configuration');
var testRunner      	= require('../test/test-runner');

module.exports = function(program) {

	program
		.command('validate <ramlfile> <server>')
		.version('0.0.1')
		.description('validates RAML file against API')
		.action(function (ramlfile, server) {
			var generator = new testGenerator(ramlfile, server);
            var runner = new testRunner();

			var config = new testConfiguration(__dirname + '/config.json');

			generator.getAllTests(config).forEach(function(test) {
                runner.addTest(test);
			});

            runner.runTests();
		});
};
