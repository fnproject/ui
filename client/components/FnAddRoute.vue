<template>


  <modal title="Add Route" :show="show" @closed="closed" @ok="ok" @cancel="closed" okText="Save" okClass="btn btn-primary">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">Path *</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="e.g. /hello">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">Image</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="e.g. iron/hello">
          </div>
        </div>
      </form>
    </modal>


</template>
<script>
import Modal from '../lib/vue-bootstrap-modal.vue';
import { eventBus } from '../client';

export default {
  props: [],
  components: {
    Modal
  },
  data: function(){
    return {
      show: false
    }
  },
  methods: {
    closed: function(){
      this.show = false;
    },
    ok: function(){},
  },
  created:  function (){
    eventBus.$on('openAddRoute', () => {
      this.show = true;
    });
  }
}
</script>