<template >
  <line-chart 
    :chart-data="datacollection"
    :options="{
      animation: {
        duration:0 // turn off annoying bouncing animation
      },
      scales: {
        yAxes: [{
          stacked: false, // this is the default, change to true to make stacked
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
          this.datacollection = {
            labels: this.statshistory.map(eachStatistic => "" ),
            datasets: [
              {
                label: 'Completed: ' + this.stats.Complete,
                backgroundColor: 'lightgreen',
                data: this.statshistory.map(eachStatistic => eachStatistic.Complete )
              }
            ]
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
