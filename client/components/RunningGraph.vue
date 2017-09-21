<template >
  <line-chart 
    :chart-data="datacollection"
    :options="{
      responsive: true, 
      maintainAspectRatio: false,
      title: {
        display: false,
        text: 'Running'
      },
      legend: {
        display: true,
        position: 'left'
      },  
      animation: {
        duration:0 // turn off annoying bouncing animation
      },
      scales: {
        yAxes: [{
          stacked: false, // RunningGraph is not stacked
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
      //this.updateChart()
    },
    methods: {
      updateChart () {
        if (this.statshistory && this.stats){
          this.datacollection = {};
          this.datacollection["labels"]= this.statshistory.map(eachStatistic => "" );
          this.datacollection["datasets"]=[];
          for (var thisPath in this.stats.FunctionStatsMap){
            var dataSetForPath = {
              label: truncate(thisPath,15) + ": "+ this.stats.FunctionStatsMap[thisPath].Running,
              backgroundColor: 'white', // Only use fill color if chart is stacked
              borderColor: getBorderColorFor(thisPath),
              borderWidth: lineWidthInPixels,
              radius:pointRadiusInPixels,
              data: this.statshistory.map(eachStatistic => eachStatistic.FunctionStatsMap[thisPath].Running)
            };
            this.datacollection["datasets"].push(dataSetForPath);
             
          }
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
</style>