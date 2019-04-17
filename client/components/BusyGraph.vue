<template >
  <div class="singleChart">
    <h4 class="chart-title">Busy: {{this.total}}</h4>
    <div id="busyGraphLegend"></div>
    <line-chart
      :chart-data="datacollection"
      :options="{
        responsive: true,
        maintainAspectRatio: true,
        title: {
          display: false,
          text: 'Busy'
        },
        legend: {
          display: false,
        },
        animation: {
          duration:0 // turn off annoying bouncing animation
        },
        scales: {
          yAxes: [{
            stacked: false,
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
 import { updateChart, graphType} from './graphUtilities';

  export default {
    components: {
      LineChart,
    },
    props: [
      'stats',
      'statshistory',
      'appid' // this will be unset if this graph is for all apps
    ],
    data () {
      return {
        datacollection: null,
        total: 0
      }
    },
    mounted () {
    },
    methods: {
    },
    created: function(){
      // handle "stats have been refreshed"
      eventBus.$on('statsRefreshed', (app) => {
        var isStacked = false;
        updateChart(this, graphType.BUSY, isStacked);
      });
    }
  }

</script>

<style>
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
