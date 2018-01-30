<template >
  <div class="singleChart">
    <h4 class="chart-title">Failed: {{this.total}}</h4>
    <div id="failedGraphLegend"></div>
	  <line-chart 
	    :chart-data="datacollection"
	    :options="{
	      responsive: true, 
	      maintainAspectRatio: true,
	      title: {
	        display: false,
	        text: 'Failed'
	      },
	      legend: {
	        display: false,
	      },
	      animation: {
	        duration:0 // turn off annoying bouncing animation
	      },
	      scales: {
	        yAxes: [{
	          stacked: true, // FailedGraph is stacked (also set fill:true below)
	          ticks: {
	            suggestedMax: 10
	          }
	        }]
	      }     
	    }"
	    >
	  </line-chart>
  </div>
</template>

<script>
  
 import LineChart from './LineChart.js';
 import { eventBus } from '../client';
 import { getBackgroundColorFor, getBorderColorFor, lineWidthInPixels, pointRadiusInPixels} from '../client'; 
 import { truncate} from '../pages/utilities.js'; 
 import { isPathIn} from '../pages/utilities.js'; 

  export default {
    components: {
      LineChart,
    },
    props: [
      'routes',
      'stats',
      'statshistory',
      'appname'
    ],
    data () {
      return {
        datacollection: null,
        total: 0
      }
    },
    mounted () {
      //this.updateChart();
    },
    methods: {
      updateChart () {
        // update the chart to display data for the routes in "routes", or for all routes if "routes" is not set 
        var totalCount = 0; 
        if (this.statshistory && this.stats){
          this.datacollection = {};
          this.datacollection["labels"]= this.statshistory.map(eachStatistic => "" );
          this.datacollection["datasets"]=[];
          for (var thisPath in this.stats.FunctionStatsMap){
            if (this.routes==null || isPathIn(thisPath,this.routes)){
              totalCount = totalCount + this.stats.FunctionStatsMap[thisPath].Failed;          
              var dataSetForPath = {
                label: thisPath + ": "+ this.stats.FunctionStatsMap[thisPath].Failed,
                fill: true,                                       // Set to true because chart is stacked
                backgroundColor: getBackgroundColorFor(thisPath), // Set color because chart is stacked
                borderColor: getBorderColorFor(thisPath),
                borderWidth: lineWidthInPixels,
                radius:pointRadiusInPixels,
                data: this.statshistory.map(eachStatistic => eachStatistic.FunctionStatsMap[thisPath].Failed)
              };
              this.datacollection["datasets"].push(dataSetForPath);
            }   
          }
          this.total = totalCount;

          // legend  
          var legs = document.getElementById("failedGraphLegend");
          var text = [];
          text.push('<ul class=\'' + 'chartLegend\'>');
          var chartDataDatasets = this.datacollection["datasets"];
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
    },
    created: function(){
      // handle "stats have been refreshed"
      eventBus.$on('statsRefreshed', (app) => {
        this.updateChart();
      });    
    }
  }

</script>

<style>
.chartLegend{
}
.chartLabelEmblem {
  float:left;
  width:40px;
  height:14px;
  line-height:20px;
  margin-top:3px;
  margin-left:10px;
  margin-right:6px;
  border:1px solid;
  font-size:8px;
}
.chartLabelText {
  font-size:14px;
}

ul.chartLegend{
  margin-right:10px;
  list-style-type: none;
  padding-left:0px;
}
</style>
