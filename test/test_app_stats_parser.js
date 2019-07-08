/**
 * Test the AppStatsParser class
 */

const AppStatsParser = require('../server/helpers/app-stats-parser.js');
const sharedStatsParserLibs = require('./lib/shared-stats-parser-libs.js');
const sharedStatsParserTests = require('./lib/shared-stats-parser-tests.js');
const UnitTestData = require('./lib/unit-test-data.js');

describe('Test App Stats Parser', function() {
  let tests = [
    expectedStatsData(),
    missingLabelData(),
    additionalLabelData(),
    reorderedLabelData(),
    sharedStatsParserTests.irrelevantStatsData(),
    sharedStatsParserTests.invalidStatsData(),
    unexpectedData(),
  ];

  sharedStatsParserLibs.run_tests(new AppStatsParser(), tests);
});

/**
 * Test the parser correctly handles data it is expected to parse
 */
function expectedStatsData() {
  let test = 'parse expected data';

  let inputData = `
# HELP fn_container_start_total containers in state container_start_total
# TYPE fn_container_start_total untyped
fn_container_start_total{app_id="01D7MD7GTBNG8G00GZJ0000001",fn_id="01D7MD7M48NG8G00GZJ0000002",image_name="fndemouser/testapp:0.0.2"} 3.0
fn_container_start_total{app_id="01D8JQSKDENG8G00GZJ000000B",fn_id="01D8JQSQ2VNG8G00GZJ000000C",image_name="fndemouser/sleepy:0.0.10"} 0.0
fn_container_start_total{app_id="01D8JQSKDENG8G00GZJ000000B",fn_id="01D8RVJ0QANG8G00GZJ000000J",image_name="fndemouser/sleeplonger:0.0.2"} 9.0
# HELP fn_container_busy_total containers in state container_busy_total
# TYPE fn_container_busy_total untyped
fn_container_busy_total{app_id="01D7MD7GTBNG8G00GZJ0000001",fn_id="01D7MD7M48NG8G00GZJ0000002",image_name="fndemouser/testapp:0.0.2"} 0.0
fn_container_busy_total{app_id="01D8JQSKDENG8G00GZJ000000B",fn_id="01D8JQSQ2VNG8G00GZJ000000C",image_name="fndemouser/sleepy:0.0.10"} 1.0
fn_container_busy_total{app_id="01D8JQSKDENG8G00GZJ000000B",fn_id="01D8RVJ0QANG8G00GZJ000000J",image_name="fndemouser/sleeplonger:0.0.2"} 54.0
# HELP fn_container_idle_total containers in state container_idle_total
# TYPE fn_container_idle_total untyped
fn_container_idle_total{app_id="01D7MD7GTBNG8G00GZJ0000001",fn_id="01D7MD7M48NG8G00GZJ0000002",image_name="fndemouser/testapp:0.0.2"} 2.0
fn_container_idle_total{app_id="01D8JQSKDENG8G00GZJ000000B",fn_id="01D8JQSQ2VNG8G00GZJ000000C",image_name="fndemouser/sleepy:0.0.10"} 1.0
fn_container_idle_total{app_id="01D8JQSKDENG8G00GZJ000000B",fn_id="01D8RVJ0QANG8G00GZJ000000J",image_name="fndemouser/sleeplonger:0.0.2"} 0.0
# HELP fn_container_paused_total containers in state container_paused_total
# TYPE fn_container_paused_total untyped
fn_container_paused_total{app_id="01D7MD7GTBNG8G00GZJ0000001",fn_id="01D7MD7M48NG8G00GZJ0000002",image_name="fndemouser/testapp:0.0.2"} 0.0
fn_container_paused_total{app_id="01D8JQSKDENG8G00GZJ000000B",fn_id="01D8RVJ0QANG8G00GZJ000000J",image_name="fndemouser/sleeplonger:0.0.2"} 3.0
# HELP fn_container_wait_total containers in state container_wait_total
# TYPE fn_container_wait_total untyped
fn_container_wait_total{app_id="01D7MD7GTBNG8G00GZJ0000001",fn_id="01D7MD7M48NG8G00GZJ0000002",image_name="fndemouser/testapp:0.0.2"} 107.0
fn_container_wait_total{app_id="01D8JQSKDENG8G00GZJ000000B",fn_id="01D8JQSQ2VNG8G00GZJ000000C",image_name="fndemouser/sleepy:0.0.10"} 5.0
fn_container_wait_total{app_id="01D8JQSKDENG8G00GZJ000000B",fn_id="01D8RVJ0QANG8G00GZJ000000J",image_name="fndemouser/sleeplonger:0.0.2"} 0.0
`;

  let expectedResult = {
    '01D7MD7GTBNG8G00GZJ0000001': {
      'Functions': {
        '01D7MD7M48NG8G00GZJ0000002': {
          'Busy': 0,
          'Idling': 2,
          'Paused': 0,
          'Starting': 3,
          'Waiting': 107,
        },
      },
    },
    '01D8JQSKDENG8G00GZJ000000B': {
      'Functions': {
        '01D8JQSQ2VNG8G00GZJ000000C': {
          'Busy': 1,
          'Idling': 1,
          'Starting': 0,
          'Waiting': 5,
        },
        '01D8RVJ0QANG8G00GZJ000000J': {
          'Busy': 54,
          'Idling': 0,
          'Paused': 3,
          'Starting': 9,
          'Waiting': 0,
        },
      },
    },
  };

  return new UnitTestData(test, inputData, expectedResult);
}

/**
 * Test how the parser copes with missing label data
 */
function missingLabelData() {
  let test = 'handle missing label data';

  let inputData =`
fn_container_busy_total{app_id="01D7MD7GTBNG8G00GZJ0000001",fn_id="01D7MD7M48NG8G00GZJ0000002"} 1.0
fn_container_wait_total{app_id="01D7MD7GTBNG8G00GZJ0000001",image_name="fndemouser/testapp:0.0.2"} 2.0
fn_container_paused_total{fn_id="01D7MD7M48NG8G00GZJ0000002",image_name="fndemouser/testapp:0.0.2"} 3.0
fn_container_start_total 4.0
`;

  let expectedResult = {
    '01D7MD7GTBNG8G00GZJ0000001': {
      'Functions': {
        '01D7MD7M48NG8G00GZJ0000002': {
          'Busy': 1,
        },
        undefined: {
          'Waiting': 2,
        }
      },
    },
    undefined: {
      'Functions': {
        '01D7MD7M48NG8G00GZJ0000002': {
          'Paused': 3,
        },
      },
    },
  };

  return new UnitTestData(test, inputData, expectedResult);
}

/**
 * Test how the parser copes with label data it isn't expecting to see
 */
function additionalLabelData() {
  let test = 'handle additional label data';

  let inputData = `
fn_container_start_total{app_id="01D7MD7GTBNG8G00GZJ0000001",fn_id="01D7MD7M48NG8G00GZJ0000002",image_name="fndemouser/testapp:0.0.2",extra_data="additional_data"} 1.0
`;

  let expectedResult = {
    '01D7MD7GTBNG8G00GZJ0000001': {
      'Functions': {
        '01D7MD7M48NG8G00GZJ0000002': {
          'Starting': 1,
        },
      },
    },
  };

  return new UnitTestData(test, inputData, expectedResult);
}

/**
 * Test the parser is able to parse the label data, no matter what order it's
 * in
 */
function reorderedLabelData() {
  let test = 'handle re-ordered label data';

  let inputData = `
fn_container_start_total{fn_id="01D7MD7M48NG8G00GZJ0000002",app_id="01D7MD7GTBNG8G00GZJ0000001",image_name="fndemouser/testapp:0.0.2"} 3.0
`;

  let expectedResult = {
    '01D7MD7GTBNG8G00GZJ0000001': {
      'Functions': {
        '01D7MD7M48NG8G00GZJ0000002': {
          'Starting': 3,
        },
      },
    },
  };

  return new UnitTestData(test, inputData, expectedResult);
}

/**
 * Test the parser can handle data that it isn't expecting
 */
function unexpectedData() {
  let test = 'handle unexpected data';

  let inputData = `
fn_container_wait_total{app_id="",fn_id="",image_name=""} 1.1
`;

  let expectedResult = {
    '': {
      'Functions': {
        '': {
          'Waiting': 1,
        },
      },
    },
  };

  return new UnitTestData(test, inputData, expectedResult);
}
