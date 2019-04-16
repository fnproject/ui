var express = require('express');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');
var logger = require('config-logger');

router.get('/', function(req, res) {
  successcb = function(data){
    // convert the raw Prometheus data to JSON in a form usable by the client

    var queuedLabel = 'fn_queued';
    var runningLabel = 'fn_running';
    var completedlabel = "fn_completed";

    // Construct a RE to extract data from the raw Prometheus metrics data, which will include lines like
    // "fn_completed 21"

    // metricNameRE matches any of the required metric names, and saves the metric name
    var metricNameRE = '('+queuedLabel+'|'+runningLabel+'|'+completedlabel+')';

    // labelNameRE matches a label name, which is anything that's not a = (equals sign), and saves the label name
    var labelNameRE = '([^=]+)';   
    // labelValueRE matches a label value, which is anything that's not a " (double quote), and save the label value
    var labelValueRE = '\"([^\"]*)\"'; 
    // labelRE is a combined label name/value pair
    var labelRE = labelNameRE+'='+labelValueRE;

    // spacesRE matches one or more spaces
    var spacesRE = '\\s+';            
    //  valueRE matches one or more numeric digits, and saves the metric value
    var valueRE = '(\\d+)'             
    
    // allMetricsRE is the complete RE (allowing for more than two labels)
    var allMetricsRE    = '^' + metricNameRE + spacesRE + valueRE;

    var regex = RegExp(allMetricsRE,'gm');

    // metricData contains the data extracted from a single line of /metrics data
    var metricData;

    //metricData[0] = the whole line (only used in error messages)
    //metricData[1] = metric name (one of fn_queued|fn_running|fn_completed)
    //metricData[2] = metric value (integer)
    const WHOLE_MATCH = 0;
    const METRIC_NAME = 1;
    const METRIC_VALUE = 2;

    // jsonData is an object representation of the JSON data that will be returned to the client
    var jsonData = {"Queue":0, "Running":0, "Complete":0}

    while ((metricData = regex.exec(data)) !== null) {
      // we have found a single metric value

      if (metricData.length < 3){
        logger.error("Unexpected metrics data: " + metricData[WHOLE_MATCH]);
        continue;
      }

      logger.debug("Processing " + metricData[WHOLE_MATCH]);

      // get metric name
      var metricName = metricData[METRIC_NAME];

      // get metric value
      var metricValue = parseInt(metricData[METRIC_VALUE]);

      switch (metricName){
        case queuedLabel:
        jsonData.Queue=metricValue;
        break;
        case runningLabel:
        jsonData.Running=metricValue;
        break;
        case completedlabel:
        jsonData.Complete=metricValue;
        break;
      }
    }

    res.json(jsonData);
  }

  // get the raw Prometheus data
  helpers.getApiEndpointRaw(req, "/metrics", {}, successcb, helpers.standardErrorcb(res))

});


module.exports = router;
