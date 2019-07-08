/**
 * This module contains stats parser tests that are applicable to multiple
 * Stats parsers
 */

const UnitTestData = require('./unit-test-data.js');

/**
 * Test the parsers ignore Prometheus data that they aren't looking for
 *
 * @return {UnitTestData}
 */
exports.irrelevantStatsData = function() {
  let test = 'ignore irrelevant data';

  let inputData = `
# HELP fn_api_latency Latency distribution of API requests
# TYPE fn_api_latency histogram
fn_api_latency_bucket{blame="service",method="GET",path="/metrics",status="200",le="1.0"} 6.0
go_memstats_mspan_inuse_bytes 72200.0
go_threads 13.0
fn_calls 2.0
fn_errors 1.0
fn_util_mem_used 0.0
fn_container_wait_duration_seconds_bucket{app_id="01D8JQSKDENG8G00GZJ000000B",fn_id="01D8RVJ0QANG8G00GZJ000000J",image_name="fndemouser/sleeplonger:0.0.2",le="120000.0"} 3.0
`;

  let expectedResult = {};

  return new UnitTestData(test, inputData, expectedResult);
};

/**
 * Test the parsers ignore invalid Prometheus data
 *
 * @return {UnitTestData}
 */
exports.invalidStatsData = function() {
  let test = 'handle invalid data';

  // Test things such as negative/non-numeric fn stats and also stats that
  // contain app data which shouldn't
  let inputData = `
fn_queued {app_id="01D8JQSKDENG8G00GZJ000000B",fn_id="01D8JQSQ2VNG8G00GZJ000000C",image_name="fndemouser/sleepy:0.0.10"} 9.0
fn_running invalid
fn_complete -54
`;

  let expectedResult = {};

  return new UnitTestData(test, inputData, expectedResult);
};
