<template >
  <div class="row">
    <busy-graph :stats="stats" :statshistory="statshistory" :appid="appid"></busy-graph>
  </div>
</template>

<script>
  import { eventBus } from '../client';
  import BusyGraph from '../components/BusyGraph';

  export default {
    components: {
      BusyGraph,
    },
    props: [
      'completedLegendMarkup',
      'stats',
      'statshistory',
      'appid'
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
