<template >
  <div class="row">
    <div class="col-lg-4 col-md-6 col-sm-12">
      <queued-running-graph :stats="stats" :statshistory="statshistory"></queued-running-graph>
    </div>
    <div class="col-lg-4 col-md-6 col-sm-12">
      <completed-graph :stats="stats" :statshistory="statshistory"></completed-graph>
    </div>
  </div>    
</template>

<script>
  import { eventBus } from '../client';
  import CompletedGraph from '../components/CompletedGraph';
  import QueuedRunningGraph from '../components/QueuedRunningGraph';
 
  export default {
    components: {
      QueuedRunningGraph,
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
