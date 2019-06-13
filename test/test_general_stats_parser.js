/**
 * Test the GeneralStatsParser class
 */

const GeneralStatsParser = require('../server/helpers/general-stats-parser.js');
const sharedStatsParserLibs = require('./lib/shared-stats-parser-libs.js');
const sharedStatsParserTests = require('./lib/shared-stats-parser-tests.js');
const UnitTestData = require('./lib/unit-test-data.js');

describe('Test General Stats Parser', function() {
  let tests = [
    expectedStatsData(),
    sharedStatsParserTests.irrelevantStatsData(),
    sharedStatsParserTests.invalidStatsData(),
  ];

  sharedStatsParserLibs.run_tests(new GeneralStatsParser(), tests);
});

/**
 * Test the parser correctly handles data it is expected to parse
 */
function expectedStatsData() {
  let test = 'parse expected data';

  // Test things like Prometheus comments and multi-digit values
  let inputData = `
# HELP fn_queued calls currently queued against agent
# TYPE fn_queued untyped
fn_queued 9.0
# HELP fn_running calls currently running in agent
# TYPE fn_running untyped
fn_running 987.0
# HELP fn_completed calls completed in agent
# TYPE fn_completed untyped
fn_completed 9876.0
`;

  let expectedResult = {
    'Queue': 9,
    'Running': 987,
    'Complete': 9876,
  };

  return new UnitTestData(test, inputData, expectedResult);
}
