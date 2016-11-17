/* validate commander component
 * To use add require('../cmds/validate.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

var TestRunner = require('../raml/raml-test-runner');

module.exports = function(program) {

	program
		.command('validate <ramlfile> <server> <configurationfile>')
		.version('0.0.1')
		.description('validates RAML file against API')
		.action(function (ramlfile, server, configurationfile) {
			var testRunner = new TestRunner(configurationfile, ramlfile, server);
			testRunner.run();
		});
};
