// Utility functions used by the graph components QueuedGraph, RunningGraph, CompletedGraph and FailedGraph

// Update the graph and legend for the specified chart using the data in chart.stats and chart.statshistory 
export function updateChart (chart,graphTypeArg,isStacked) {

  // work out the name of the div that contains the legend: this must exist in the corresponding *Graph.vue file
  // work out the function to extract the required metric from a stats object from JSON
  var graphLegendDivName;
  var dataGetter;
  switch(graphTypeArg){
    case graphType.QUEUED:
      graphLegendDivName="queuedGraphLegend";
      dataGetter=aStat => aStat.FunctionStatsMap[thisPath].Queued;
      break;
    case graphType.RUNNING:
      graphLegendDivName="runningGraphLegend";
      dataGetter=aStat => aStat.FunctionStatsMap[thisPath].Complete;
      break;
    case graphType.COMPLETED:
      graphLegendDivName="completedGraphLegend";
      dataGetter=aStat => aStat.FunctionStatsMap[thisPath].Complete;
      break;
    case graphType.FAILED:
      graphLegendDivName="failedGraphLegend";
      dataGetter=aStat => aStat.FunctionStatsMap[thisPath].Failed;
      break;
  }

  // update the chart to display data for the routes in "routes", or for all routes if "routes" is not set 
  var totalCount = 0; 
  if (chart.statshistory && chart.stats){
      chart.datacollection = {};
      chart.datacollection["labels"]= chart.statshistory.map(eachStatistic => "" );
      chart.datacollection["datasets"]=[];
    for (var thisPath in chart.stats.FunctionStatsMap){
      if (chart.routes==null || isPathIn(thisPath,chart.routes)){
        totalCount = totalCount + chart.stats.FunctionStatsMap[thisPath].Complete;
        var dataSetForPath = {
          label: thisPath + ": "+ chart.stats.FunctionStatsMap[thisPath].Complete,
          fill: isStacked, // Use fill for stacked charts to distingush them from non-stacked charts
          backgroundColor: isStacked ? getBackgroundColorFor(thisPath) : 'white', // Set fill color for stacked charts
          borderColor: getBorderColorFor(thisPath),
          borderWidth: lineWidthInPixels,
          radius:pointRadiusInPixels,
          data: chart.statshistory.map(dataGetter) // use the appropriate dataGetter for this particular graph type
        };
        chart.datacollection["datasets"].push(dataSetForPath);
      }
    }
    chart.total = totalCount;
    
    // legend  
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
    // end of legend   
  }

}

// return whether any of the specified routes has the specified path
// thisPath - string
// routes - an array of route objects
export function isPathIn(path,routes){
  var result = false; 
  for (var k= 0; k < routes.length; k++){
       if (path==routes[k].path){
       return true;
      }
  }
};

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

