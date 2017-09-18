<template >
  <line-chart 
    :chart-data="datacollection"
    :options="{
      title: {
        display: true,
        text: 'Queued'
      },
      animation: {
        duration:0 // turn off annoying bouncing animation
      },
      scales: {
        yAxes: [{
          stacked: true, 
          ticks: {
            suggestedMax: 10
          }
        }]
      }     
    }"
    >
  </line-chart>
  </line-chart>
</template>

<script>
  
 import LineChart from './LineChart.js';
 import { eventBus } from '../client';
 import { getBackgroundColorFor, getBorderColorFor } from '../client'; 
 
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
              label: thisPath + ": "+ this.stats.FunctionStatsMap[thisPath].Queue,
              backgroundColor: getBackgroundColorFor(thisPath),
              borderColor: getBorderColorFor(thisPath),
              data: this.statshistory.map(eachStatistic => eachStatistic.FunctionStatsMap[thisPath].Queue)
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
  .small {
    max-width: 600px;
  }
</style>
