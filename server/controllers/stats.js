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
    var failedLabel = "fn_failed";
    var appNameMetric = "fn_appname";
    var pathNameMetric = "fn_path";

    // Construct a RE to extract data from the raw Prometheus metrics data, which will include lines like
    // fn_completed{fn_appname="hello-cold-async-a",fn_path="/hello-cold-async-a2"} 21

    // metricNameRE matches any of the required metric names, and saves the metric name
    var metricNameRE = '('+queuedLabel+'|'+runningLabel+'|'+completedlabel+'|'+failedLabel+')'; 

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
    var allMetricsRE    = '^' + metricNameRE + '{'+labelRE+'(?:,'+labelRE+')+}'+spacesRE+valueRE;

    var regex = RegExp(allMetricsRE,'gm');

    // metricData contains the data extracted from a single line of /metrics data
    var metricData; 
    //metricData[0] = the whole line (only used in error messages)
    //metricData[1] = metric name (one of fn_queued|fn_running|fn_completed|fn_failed)
    //metricData[2] = fn_appname (identifies the subsequent element)
    //metricData[3] = app name
    //metricData[4] = fn_path (identifies the subsequent element)
    //metricData[5] = path name  
    //metricData[6] = metric value (integer)

    // jsonData is an object representation of the JSON data that will be returned to the client
    // See https://github.com/fnproject/fn/pull/735 for an example of the JSON format generated (but we don't bother with the totals)
    var jsonData = {"Apps":{}}
   
    while ((metricData = regex.exec(data)) !== null) {
      // we have found a single metric value

      if (metricData.length<1){
        logger.error("Unexpected metrics data");
        continue;
      } else if (metricData.length<7){
        logger.error("Unexpected metrics data: "+metricData[0]);
        continue;
      }

      logger.debug("Processing "+metricData[0]);

      // get metric name
      var metricName = metricData[1];

      // get app name (don't assume order of labels)
      var appName
      if (metricData[2]==appNameMetric){
        appName = metricData[3];
      } else if (metricData[4]==appNameMetric){
        appName = metricData[5];
      } else {
        logger.error("Unexpected metrics data: "+appNameMetric+" not found in "+metricData[0]);
        continue;
      }

      // get path name (don't assume order of labels)
      var pathName
      if (metricData[4]==pathNameMetric){
        pathName = metricData[5];
      } else if (metricData[2]==pathNameMetric){
        pathName = metricData[3];
      } else {
        logger.error("Unexpected metrics data: "+pathNameMetric+" not found in "+metricData[0]);
        continue;
      }

      // get metric value
      var metricValue = parseInt(metricData[6]);

      // add to jsonData
      if (jsonData.Apps[appName]==null){
        jsonData.Apps[appName] = {"Routes":{}};
      }
      if (jsonData.Apps[appName].Routes[pathName]==null){
        jsonData.Apps[appName].Routes[pathName]={"Queue":0,"Running":0,"Complete":0,"Failed":0};
      }
      switch (metricName){
        case queuedLabel:
        jsonData.Apps[appName].Routes[pathName].Queue=metricValue;
        break;
        case runningLabel:
        jsonData.Apps[appName].Routes[pathName].Running=metricValue;
        break;
        case completedlabel:
        jsonData.Apps[appName].Routes[pathName].Complete=metricValue;
        break;
        case failedLabel:
        jsonData.Apps[appName].Routes[pathName].Failed=metricValue;
        break;                        
      }
    }

    res.json(jsonData);
  }

  // get the raw Prometheus data
  helpers.getApiEndpointRaw(req, "/metrics", {}, successcb, helpers.standardErrorcb(res))

});


module.exports = router;
