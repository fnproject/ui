<template >
  <line-chart 
    :chart-data="datacollection"
    :options="{
      responsive: true, 
      maintainAspectRatio: true,
      title: {
        display: false,
        text: 'Completed'
      },
      legend: {
        display: false,
      },
      animation: {
        duration:0 // turn off annoying bouncing animation
      },
      scales: {
        yAxes: [{
          stacked: true, // CompletedGraph is stacked
          ticks: {
            suggestedMax: 10
          }
        }]
      }     
    }"
    >
  </line-chart>
</template>

<script>
  
 import LineChart from './LineChart.js';
 import { eventBus } from '../client';
 import { getBackgroundColorFor, getBorderColorFor, lineWidthInPixels, pointRadiusInPixels} from '../client'; 
 import { truncate} from '../pages/utilities.js'; 

  export default {
    components: {
      LineChart,
    },
    props: [
      'stats',
      'statshistory'
    ],
    data () {
      return {
        datacollection: null,
      }
    },
    mounted () {
      //this.updateChart();
    },
    methods: {
      updateChart () {
        if (this.statshistory && this.stats){
          this.datacollection = {};
          this.datacollection["labels"]= this.statshistory.map(eachStatistic => "" );
          this.datacollection["datasets"]=[];
          for (var thisPath in this.stats.FunctionStatsMap){
            var dataSetForPath = {
              label: thisPath + ": "+ this.stats.FunctionStatsMap[thisPath].Complete,
              fill: false, // Only use fill if chart is stacked
              backgroundColor: 'white', // needed if fill is false to set fill color in legend
              borderColor: getBorderColorFor(thisPath),
              borderWidth: lineWidthInPixels,
              radius:pointRadiusInPixels,
              data: this.statshistory.map(eachStatistic => eachStatistic.FunctionStatsMap[thisPath].Complete)
            };
            this.datacollection["datasets"].push(dataSetForPath);
             
          }
          var legs = document.getElementById("completedGraphLegend");
        
          // legend  
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
          legs.innerHTML  = text.join(''); 
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
