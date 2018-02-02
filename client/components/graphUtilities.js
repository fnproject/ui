// Utility functions used by the graph components QueuedGraph, RunningGraph, CompletedGraph and FailedGraph

// Update the graph and legend for the specified chart using the data in chart.stats and chart.statshistory 
export function updateChart (chart,graphTypeArg,isStacked) {

  // work out the name of the div that contains the legend: this must exist in the corresponding *Graph.vue file
  // work out the function to extract the required metric from a stats object from JSON
  var graphLegendDivName
  var metricGetter;
  switch(graphTypeArg){
    case graphType.QUEUED:
      graphLegendDivName="queuedGraphLegend";
      metricGetter=aRoute => aRoute.Queue;
      break;
    case graphType.RUNNING:
      graphLegendDivName="runningGraphLegend";
      metricGetter=aRoute => aRoute.Running;
      break;
    case graphType.COMPLETED:
      graphLegendDivName="completedGraphLegend";
      metricGetter=aRoute => aRoute.Complete;
      break;
    case graphType.FAILED:
      graphLegendDivName="failedGraphLegend";
      metricGetter=aRoute => aRoute.Failed;
      break;
  }

  // update the chart to display data for the routes in "routes", or for all routes if "routes" is not set 
  if (chart.statshistory && chart.stats){
    chart.datacollection = {};
    chart.datacollection["labels"]= chart.statshistory.map(eachStatistic => "" );
    chart.datacollection["datasets"]=[];

    // update the graph 
    // and also calculate and display the total count
    var totalCount = 0; 
    if (chart.appname==null){
      // display all routes for all apps
      for (var thisAppName in chart.stats.Apps){
        var thisApp = chart.stats.Apps[thisAppName];
        for (var thisPath in thisApp.Routes){
          totalCount += displayRoute(chart,thisAppName,thisPath,metricGetter,isStacked);
        }
      }
    } else {
      // display routes for a specific app
      var thisApp = chart.stats.Apps[chart.appname];
      if (thisApp!=null){
        for (var thisPath in thisApp.Routes){
          totalCount += displayRoute(chart,chart.appname,thisPath,metricGetter,isStacked);
        }      
      } else {
        // we're displaying an app, but there's no data about it in the stats returned by Fn server
        // this means that no route in this app was called since the server was started
        // since these graphs currently follow the convention that they only display lines for routes that have been actually used,
        // we display nothing here. https://github.com/fnproject/ui/issues/18  proposes this be changed, but that's a wider issue.
      }
    }
    chart.total = totalCount;
    
    // now examine the data that the graph is displaying and use it to construct the legend  
    var legs = document.getElementById(graphLegendDivName);
    var text = [];
    text.push('<ul class=\'' + 'chartLegend\'>');
    var chartDataDatasets = chart.datacollection["datasets"];
    var chartDataDatasetsLength = chartDataDatasets.length;
    for (var i = 0; i < chartDataDatasets.length; i++) {
      text.push('<li><span class=\'chartLabelEmblem\' style=\'' +
        'background-color:' + chartDataDatasets[i].backgroundColor + '; ' +
        'border-color:' + chartDataDatasets[i].borderColor + ';' +
        '\'></span>');
      if (chartDataDatasets[i].label) {
        text.push('<span class=\'chartLabelText\'>'+chartDataDatasets[i].label+'</span>');
      }
      text.push('</li>');
    }
    text.push('</ul>');
    if (legs!=null){
      legs.innerHTML  = text.join(''); 
    }
  }
}

// for the specified appName and path, display a single line on the specified chart, showing historical values of the metric 
// in addition, return the current value of the metric 
function displayRoute(chart,appName,path,metricGetter,isStacked) {
  var thisApp = chart.stats.Apps[appName];
  var value = getMetricFor(chart.stats,appName,path,metricGetter)
  // assemble an array containing historical values of the metric that this graph is displaying
  var routeHistory = [];  
  for (var i = 0; i < chart.statshistory.length; i++) {
    routeHistory.push(getMetricFor(chart.statshistory[i],appName,path,metricGetter));
  }
  var dataSetForPath = {
    label: path + ": "+ value,
    fill: isStacked, // Use fill for stacked charts to distingush them from non-stacked charts
    backgroundColor: isStacked ? getBackgroundColorFor(path) : 'white', // Use a fill color for stacked charts
    borderColor: getBorderColorFor(path),
    borderWidth: lineWidthInPixels,
    radius:pointRadiusInPixels,
    data: routeHistory
  };
  chart.datacollection["datasets"].push(dataSetForPath);
  return value;
}

// return the metric value from the specified stats object for the specified appName and path
// if either the appName or path are not found then zero is returned
function getMetricFor(aStats,appName,path,metricGetter){
  var app = aStats.Apps[appName];
  if (app==null){
    // we didn't have any information about this app at the time this historical stat was added
    // either we have a partially-initialised statshistory or the app has not been created yet
    return 0;
  } else {
    var route = app.Routes[path];
    if (route==null){
      // although we had information about this app at the time this historical stat was added
      // we didn't have any information about the routre
      // this means the route has not been created yet
      return 0;
    } else {
      return metricGetter(route);
    }
  }
}

export var graphType = {
  QUEUED: 0,
  RUNNING: 1,
  COMPLETED: 2,
  FAILED: 3,
};

// factory for background colors; simply iterate round these arrays of colors
const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)' ];
const borderColors = ['rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)',  'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'];

export const lineWidthInPixels = 1;
export const pointRadiusInPixels = 0.5;
    
var backgroundColorMap = {}
export function getBackgroundColorFor(path){
  if (!backgroundColorMap[path]){
    backgroundColorMap[path]=backgroundColors[(Object.keys(backgroundColorMap).length) % (backgroundColors.length)];
  }
    return backgroundColorMap[path];
}

var borderColorMap = {}
export function getBorderColorFor(path){
  if (!borderColorMap[path]){
    borderColorMap[path]=borderColors[(Object.keys(borderColorMap).length) % (borderColors.length)];
  }
  return borderColorMap[path];
}

