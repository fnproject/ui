<template>


  <modal title="Add Route" :show="show" @closed="closed" @ok="ok" @cancel="closed" okText="Save" okClass="btn btn-primary">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">Path *</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="e.g. /hello" v-model="route.path">
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">Image</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="e.g. iron/hello"  v-model="route.image">
          </div>
        </div>
      </form>
    </modal>


</template>
<script>
import Modal from '../lib/vue-bootstrap-modal.vue';
import { eventBus } from '../client';

export default {
  props: ['app'],
  components: {
    Modal
  },
  data: function(){
    return {
      show: false,
      route: {}
    }
  },
  methods: {
    closed: function(){
      this.show = false;
    },
    ok: function(){
      eventBus.$emit('NotificationClear');
      $.ajax({
        url: '/api/apps/' + encodeURIComponent(this.app.name) + '/routes',
        method: 'POST',
        dataType: 'json',
        success: (res) => {
          eventBus.$emit('RouteAdded', this.route);
          this.closed();
        },
        error: function(jqXHR, textStatus, errorThrown){
          console.log("error", jqXHR, textStatus, errorThrown)
          var text = "Error " + jqXHR.status + '. Can not complete action';
          try {
            text = jqXHR.responseJSON.msg
          } catch (err) {}
          eventBus.$emit('NotificationError', text);
        }
      })
    },
  },
  created:  function (){
    eventBus.$on('openAddRoute', () => {
      this.show = true;
    });
  }
}
</script>