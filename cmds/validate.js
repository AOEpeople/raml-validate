/* validate commander component
 * To use add require('../cmds/validate.js')(program) to your commander.js based node executable before program.parse
 */
'use strict';

var TestRunner = require('../raml/raml-test-runner');

module.exports = function(program) {

    program
        .command('validate <ramlfile> <server> <configurationfile>')
        .description('validates RAML file against API')
        .option("-o, --output [file]", "outputs a report file")
        .action(function (ramlfile, server, configurationfile, options) {
            var testRunner = new TestRunner(configurationfile, ramlfile, server, options.output);
            testRunner.run();
        });
};
