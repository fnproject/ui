<template >
  <line-chart :chart-data="datacollection"></line-chart>
  <!-- line-chart :chart-data="datacollection" :statshistory="statshistory"></line-chart -->

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
                label: 'Queued: ' + this.stats.Queue,
                backgroundColor: 'pink',
                data: this.statshistory.map(eachStatistic => eachStatistic.Queue )
              }, {
                label: 'Running: ' + this.stats.Running,
                backgroundColor: 'lightblue',
                data: this.statshistory.map(eachStatistic => eachStatistic.Running )
              }
            ]
          }
        }
      }
    },
    created: function(){
      // handle "stats and statshistory have been refreshed"
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
