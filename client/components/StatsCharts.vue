<template >
  <div class="row">
    <template v-if="showGeneralCharts">
        <individual-stats-chart :chartConfig="queuedChartConfig" :stats="stats" :statshistory="statshistory"></individual-stats-chart>
        <individual-stats-chart :chartConfig="runningChartConfig" :stats="stats" :statshistory="statshistory"></individual-stats-chart>
        <individual-stats-chart :chartConfig="completedChartConfig" :stats="stats" :statshistory="statshistory"></individual-stats-chart>
    </template>
    <template v-if="showAppCharts">
        <individual-stats-chart :chartConfig="startingChartConfig" :stats="stats" :statshistory="statshistory" :appid="appid" :fns="fns"></individual-stats-chart>
        <individual-stats-chart :chartConfig="waitingChartConfig" :stats="stats" :statshistory="statshistory" :appid="appid" :fns="fns"></individual-stats-chart>
        <individual-stats-chart :chartConfig="busyChartConfig" :stats="stats" :statshistory="statshistory" :appid="appid" :fns="fns"></individual-stats-chart>
        <individual-stats-chart :chartConfig="idlingChartConfig" :stats="stats" :statshistory="statshistory" :appid="appid" :fns="fns"></individual-stats-chart>
        <individual-stats-chart :chartConfig="pausedChartConfig" :stats="stats" :statshistory="statshistory" :appid="appid" :fns="fns"></individual-stats-chart>
    </template>
  </div>
</template>

<script>
  import { eventBus } from '../client';
  import { chartConfig } from './graphUtilities';
  import IndividualStatsChart from '../components/IndividualStatsChart';

  export default {
    components: {
      IndividualStatsChart,
    },
    props: [
      'completedLegendMarkup',
      'stats',
      'statshistory',
      'appid',
      'fns',
      'showGeneralCharts',
      'showAppCharts',
    ],
    data() {
      return {
        queuedChartConfig: chartConfig.QUEUED,
        runningChartConfig: chartConfig.RUNNING,
        completedChartConfig: chartConfig.COMPLETED,

        startingChartConfig: chartConfig.STARTING,
        waitingChartConfig: chartConfig.WAITING,
        busyChartConfig: chartConfig.BUSY,
        idlingChartConfig: chartConfig.IDLING,
        pausedChartConfig: chartConfig.PAUSED,
      }
    }
  }
</script>

<style>

@media only screen and (min-width: 1500px) {
  .singleChart {
    width:25%;
    float:left;
  }
}
@media only screen and (min-width: 1160px) and (max-width: 1499px) {
  .singleChart {
    width:33%;
    float:left;
  }
}
@media only screen and (min-width: 450px) and (max-width: 1159px) {
  .singleChart {
    width:50%;
    float:left;
  }
}
@media only screen and (max-width: 449) {
  .singleChart {
    width:100%;
    float:left;
  }
}


.chart-title{
  text-align:center;
  padding-bottom:10px;
}
</style>
