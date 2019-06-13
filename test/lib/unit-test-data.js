/**
 * Helper class to hold unit test data
 */
module.exports = class UnitTestData {
  constructor(test, inputData, expectedResult) {
    /** @public {String} a description of the test */
    this.test = test;

    /** @public {String} the data to be processed */
    this.inputData = inputData;

    /** @public {Object} the expected result after processing the input data */
    this.expectedResult = expectedResult;
  }

  /**
   * Return a description for Mocha to use for this test
   */
  description() {
    return 'can ' + this.test;
  }

  /**
   * Return a failure message for Mocha to use for this test
   */
  failureMessage() {
    return 'parser did not ' + this.test;
  }
};
