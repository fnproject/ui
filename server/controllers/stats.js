var express = require('express');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');
var logger = require('config-logger');

router.get('/', function(req, res) {
  successcb = function(data){
    // convert the raw Prometheus data to JSON in a form usable by the client

    var generalStatsParser = new GeneralStatsParser();
    var appStatsParser = new AppStatsParser();

    var jsonData = generalStatsParser.parse(data);
    var appData = appStatsParser.parse(data);

    jsonData['Apps'] = appData;

    res.json(jsonData);
  }

  // get the raw Prometheus data
  helpers.getApiEndpointRaw(req, "/metrics", {}, successcb, helpers.standardErrorcb(res))

});

/**
 * The Stats Parser class provides base functionality that individual stats
 * parsers can reuse. It's designed for individual parsers to inherit from.
 */
class StatsParser {
    constructor() {
      // Captures the key in a Javascript Object Literal (i.e. everything before the equals sign)
      var labelNameRE = '([^=]+)';

      // Captures the value in a Javascript Object Literal (i.e. anything between the double quotes)
      var labelValueRE = '\"([^\"]*)\"';

      // Matches the key/value pair in a Javascript Object Literal
      this._labelRE = labelNameRE + '=' + labelValueRE;

      this._spacesRE = '\\s+';
      this._valueRE = '(\\d+)';
    }
}

/**
 * This parser is used to parse the fn_queue, fn_running and fn_complete data
 * from the Fn server's metrics API. This data isn't app specific, but is for
 * the whole system.
 */
class GeneralStatsParser extends StatsParser {
  constructor() {
    super();

    this._metricNames = {
      'fn_queued': 'Queue',
      'fn_running': 'Running',
      'fn_completed': 'Complete',
    };

    var metricNameRE = '(' + Object.keys(this._metricNames).join('|') + ')';
    var metricsRE = '^' + metricNameRE + this._spacesRE + this._valueRE;

    this._regex = RegExp(metricsRE, 'gm');

    //regexMatch[0] = the whole match
    //regexMatch[1] = metric name (e.g. fn_completed)
    //regexMatch[2] = metric value (integer)
    this._WHOLE_MATCH = 0;
    this._METRIC_NAME = 1;
    this._METRIC_VALUE = 2;
  }

  /*
   * Parse the Fn server stats data and return an object containing the
   * results.
   *
   * Example data structure for object being returned:
   * Complete: 3
   * Queue: 0
   * Running: 1
   *
   * @param {String} data   the data to parse.
   *
   * @return {Object}       an object representing the parsed data as per the
   *                        documentation above.
   */
  parse(data) {
    var jsonData = {};

    var metricData;
    while((metricData = this._regex.exec(data)) !== null) {
        logger.debug(
          "Processing General Stat: " + metricData[this._WHOLE_MATCH]
        );

        var metricsName = metricData[this._METRIC_NAME];
        var metricsHumanName = this._metricNames[metricsName];
        var metricsValue = parseInt(metricData[this._METRIC_VALUE]);

        jsonData[metricsHumanName] = metricsValue;
    }

    return jsonData;
  }
}

/**
 * This class is used to parse app specific stats from the Fn server's metrics
 * API.
 */
class AppStatsParser extends StatsParser {
  constructor() {
    super();

    this._metricNames = {
      'fn_container_start_total': 'Starting',
      'fn_container_busy_total': 'Busy',
      'fn_container_idle_total': 'Idling',
      'fn_container_paused_total': 'Paused',
      'fn_container_wait_total': 'Waiting',
    };

    var metricNameRE = '(' + Object.keys(this._metricNames).join('|') + ')';

    // unfortunately we cannot use ((?:, labelRE)+) as it won't capture the
    // middle key-value pair
    var metricsRE = '^' + metricNameRE + '{' + this._labelRE + ',' + this._labelRE + ',' + this._labelRE + '}' + this._spacesRE + this._valueRE;

    this._regex = RegExp(metricsRE, 'gm');

    //regexMatch[0] = the whole match
    //regexMatch[1] = metric name (e.g. fn_container_busy_total)
    //regexMatch[2-7] = keys and values for fn data (e.g. app_id, $app_id, fn_id, $fn_id, image_name, $image_name)
    //regexMatch[8] = metric value (integer)
    this._WHOLE_MATCH = 0;
    this._METRIC_NAME = 1;
    this._FN_DATA_START = 2;
    this._FN_DATA_END = 8;
    this._METRIC_VALUE = this._FN_DATA_END;
  }

  /*
   * Parse the stats data and return an object containing the app specific
   * stats.
   *
   * Example data structure for object being returned:
   * 01D8JQSKDENG8G00GZJ000000B
   *  Functions
   *    01D8JQSQ2VNG8G00GZJ000000C
   *      Images
   *        fndemouser/myimage:0.0.2
   *          Busy: 1
   *          Idling: 0
   *          Paused: 0
   *          Starting: 0
   *          Waiting: 0
   *        fndemouser/myimage:0.0.3
   *          Busy: 0
   *          Idling: 0
   *          Paused: 0
   *          Starting: 0
   *          Waiting: 1
   *
   * @param {String} data   the data to parse.
   *
   * @return {Object}       an object representing the parsed data as per the
   *                        documentation above.
   */
  parse(data) {
    var jsonData = {};

    var metricData;
    while((metricData = this._regex.exec(data)) !== null) {
      logger.debug("Processing App Stat: " + metricData[0]);

      var metricsName = metricData[this._METRIC_NAME];
      var metricsHumanName = this._metricNames[metricsName];
      var metricsValue = parseInt(metricData[this._METRIC_VALUE]);

      // The FN data is parsed as a list with the key in the first index and
      // the value in the next e.g. [key1, value1, key2, value2...].
      // Iterate over this list extracting the key-value pairs and put them
      // into a better data structure.
      var fnDataList = metricData.slice(this._FN_DATA_START, this._FN_DATA_END);
      var fnData = {};
      for(var i = 1; i < fnDataList.length; i += 2) {
        var key = fnDataList[i-1];
        var value = fnDataList[i];
        fnData[key] = value;
      }

      jsonData = this._addData(jsonData, fnData.app_id, fnData.fn_id,
        fnData.image_name, metricsHumanName, metricsValue
      );
    }

    return jsonData;
  }

  _fnData(fnDataList) {
  }

  /**
   * Adds App Data to the object that we're going to return.
   *
   * @param {Object} data   the object to append the data to.
   * @param {String} appId  the ID of the Fn App which this data belongs to.
   * @param {String} fnId   the ID of the Fn function which this data belongs to.
   * @param {String} imageName  the image name for the Fn function this data belongs to.
   * @param {String} metricsHumanName   the human readable name of the metric being recorded.
   * @param {Int} metricsValue  the value of the metric that was parsed.
   *
   * @return {Object}   the data object with the app data added.
   */
  _addData(data, appId, fnId, imageName, metricsHumanName, metricsValue) {
    if(data[appId] === undefined) {
      data[appId] = {'Functions': {}};
    }

    if(data[appId].Functions[fnId] === undefined) {
      data[appId].Functions[fnId] = {'Images': {}};
    }

    if(data[appId].Functions[fnId].Images[imageName] === undefined) {
      data[appId].Functions[fnId].Images[imageName] = {};
    }

    data[appId].Functions[fnId].Images[imageName][metricsHumanName] = metricsValue;

    return data;
  }
}

module.exports = router;
