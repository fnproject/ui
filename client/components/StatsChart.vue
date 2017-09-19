<template >
  <div class="row">
    <div class="col-lg-4 col-md-6 col-sm-12">
      <queued-graph :stats="stats" :statshistory="statshistory"></queued-graph>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-12">
      <running-graph :stats="stats" :statshistory="statshistory"></running-graph>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-12">
      <completed-graph :stats="stats" :statshistory="statshistory"></completed-graph>
    </div>
  </div>    
</template>

<script>
  import { eventBus } from '../client';
  import QueuedGraph from '../components/QueuedGraph';
  import CompletedGraph from '../components/CompletedGraph';
  import RunningGraph from '../components/RunningGraph';
 
  export default {
    components: {
      QueuedGraph,
      RunningGraph,
      CompletedGraph
    },
    props: [
      'stats',
      'statshistory'
      
    ]
  }
</script>

<style>
</style>
