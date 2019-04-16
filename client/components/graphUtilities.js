// Utility functions used by the graph components QueuedGraph, RunningGraph, and CompletedGraph

// Update the graph and legend for the specified chart using the data in chart.stats and chart.statshistory 
export function updateChart (chart,graphTypeArg,isStacked) {

  // work out the name of the div that contains the legend: this must exist in the corresponding *Graph.vue file
  // work out the function to extract the required metric from a stats object from JSON
  var graphLegendDivName
  var metricGetter;
  switch(graphTypeArg){
    case graphType.QUEUED:
      graphLegendDivName="queuedGraphLegend";
      metricGetter=results => results.Queue;
      break;
    case graphType.RUNNING:
      graphLegendDivName="runningGraphLegend";
      metricGetter=results => results.Running;
      break;
    case graphType.COMPLETED:
      graphLegendDivName="completedGraphLegend";
      metricGetter=results => results.Complete;
      break;
  }

  if (chart.statshistory && chart.stats){
    chart.datacollection = {};
    chart.datacollection["labels"]= chart.statshistory.map(eachStatistic => "" );
    chart.datacollection["datasets"]=[];

    // update the graph
    chart.total = displayMetric(chart,metricGetter,isStacked);
  }
}

// /display a single line on the specified chart, showing historical values of
// the metric in addition, return the current value of the metric
function displayMetric(chart,metricGetter,isStacked) {
  var value = getMetricFor(chart.stats,metricGetter);

  // assemble an array containing historical values of the metric that this graph is displaying
  var plotHistory = [];
  for (var i = 0; i < chart.statshistory.length; i++) {
    plotHistory.push(getMetricFor(chart.statshistory[i],metricGetter));
  }

  var dataSet = {
    label: 'Amount: ',
    fill: isStacked, // Use fill for stacked charts to distingush them from non-stacked charts
    backgroundColor: isStacked ? getBackgroundColorFor('/') : 'white', // Use a fill color for stacked charts
    borderColor: getBorderColorFor('/'),
    borderWidth: lineWidthInPixels,
    radius:pointRadiusInPixels,
    data: plotHistory
  };
  chart.datacollection["datasets"].push(dataSet);
  return value;
}

// return the metric value from the specified stats object for the specified ppName and path
// if either the appName or path are not found then zero is returned
function getMetricFor(stats,metricGetter){
  if (stats==null){
    // we didn't have any information about this app at the time this historical stat was added
    // either we have a partially-initialised statshistory or the app has not been created yet
    return 0;
  } else {
    return metricGetter(stats);
  }
}

export var graphType = {
  QUEUED: 0,
  RUNNING: 1,
  COMPLETED: 2,
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

