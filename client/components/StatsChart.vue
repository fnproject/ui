<template >
  <div class="row">
    <queued-graph :stats="stats" :statshistory="statshistory"></queued-graph>
    <running-graph :stats="stats" :statshistory="statshistory"></running-graph>
    <completed-graph :stats="stats" :statshistory="statshistory"></completed-graph>
  </div>
</template>

<script>
  import { eventBus } from '../client';
  import RunningGraph from '../components/RunningGraph';
  import QueuedGraph from '../components/QueuedGraph';
  import CompletedGraph from '../components/CompletedGraph';
 
  export default {
    components: {
      QueuedGraph,
      RunningGraph,
      CompletedGraph,
    },
    props: [
      'completedLegendMarkup',
      'stats',
      'statshistory',
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
