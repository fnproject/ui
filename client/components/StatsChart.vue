<template >
  <div class="row">
    <div class="singleChart">
      <h4 class="chart-title">Queued: {{this.stats.Queue}}</h4>
      <div id="queuedGraphLegend"></div>
      <queued-graph :stats="stats" :statshistory="statshistory"></queued-graph>
    </div>
    <div class="singleChart">
      <h4 class="chart-title">Running: {{this.stats.Running}}</h4>
      <div id="runningGraphLegend"></div>
      <running-graph :stats="stats" :statshistory="statshistory"></running-graph>
    </div>       
    <div class="singleChart">
      <h4 class="chart-title">Completed: {{this.stats.Complete}}</h4>
      <div id="completedGraphLegend"></div>
      <completed-graph :stats="stats" :statshistory="statshistory"></completed-graph>
    </div>
    <div class="singleChart">
      <h4 class="chart-title">Failed: {{this.stats.Failed}}</h4>
      <div id="failedGraphLegend"></div>
      <failed-graph :stats="stats" :statshistory="statshistory"></failed-graph>
    </div> 
  </div>
</template>

<script>
  import { eventBus } from '../client';
  import RunningGraph from '../components/RunningGraph';
  import QueuedGraph from '../components/QueuedGraph';
  import CompletedGraph from '../components/CompletedGraph';
  import FailedGraph from '../components/FailedGraph';
 
  export default {
    components: {
      QueuedGraph,
      RunningGraph,
      CompletedGraph,
      FailedGraph
    },
    props: [
      'completedLegendMarkup',
      'stats',
      'statshistory'
    ]
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
