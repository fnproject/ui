const assert = require('assert');

/**
 * Given a parser and an array of UnitTestData objects, parse each test's input
 * and check if the parsed results match the expected output.
 *
 * @param {StatsParser} parser
 * @param {Array<UnitTestData>}
 */
exports.run_tests = function(parser, tests) {
  for (let i = 0; i < tests.length; i++) {
    let test = tests[i];

    it(test.description(), function() {
      let actualResult = parser.parse(test.inputData);
      assert.deepStrictEqual(
        actualResult, this.test.expectedResult, this.test.failureMessage()
      );
    }.bind({test: test}));
  }
};
