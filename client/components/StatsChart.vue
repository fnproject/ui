<template >
  <div class="row">
    <div class="col-lg-6 col-md-12 col-sm-12">
      <h4 class="chart-title">Queued: {{this.stats.Queue}}</h4>
      <queued-graph :stats="stats" :statshistory="statshistory"></queued-graph>
    </div>
    <div class="col-lg-6 col-md-12 col-sm-12">
      <h4 class="chart-title">Running: {{this.stats.Running}}</h4>
      <running-graph :stats="stats" :statshistory="statshistory"></running-graph>
    </div>
    <div class="col-lg-6 col-md-12 col-sm-12">
      <h4 class="chart-title">Completed: {{this.stats.Complete}}</h4>
      <completed-graph :stats="stats" :statshistory="statshistory"></completed-graph>
    </div>
    <div class="col-lg-6 col-md-12 col-sm-12">
      <h4 class="chart-title">Failed: {{this.stats.Failed}}</h4>
      <failed-graph :stats="stats" :statshistory="statshistory"></failed-graph>
    </div>
  </div>    
</template>

<script>
  import { eventBus } from '../client';
  import QueuedGraph from '../components/QueuedGraph';
  import CompletedGraph from '../components/CompletedGraph';
  import RunningGraph from '../components/RunningGraph';
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
.chart-title{
  text-align:center;
  padding-bottom:10px;
}
</style>
