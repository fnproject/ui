<template>
  <modal title="Edit Route" :show="show" @closed="closed" @ok="ok" @cancel="closed">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-2 control-label">Path</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="e.g. /hello" v-model="route.path" disabled>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-2 control-label">Image</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="e.g. iron/hello"  v-model="route.image">
          </div>
        </div>
      </form>

      <div slot="footer">
        <button type="button" class="btn btn-primary" @click="ok" :disabled="submitting">Save</button>
      </div>
    </modal>
</template>

<script>
import Modal from '../lib/VueBootstrapModal.vue';
import { eventBus } from '../client';
import { defaultErrorHander } from '../lib/helpers';

export default {
  props: ['app'],
  components: {
    Modal
  },
  data: function(){
    return {
      show: false,
      submitting: false,
      route: {}
    }
  },
  methods: {
    closed: function(){
      this.show = false;
    },
    ok: function(){
      var t = this;
      eventBus.$emit('NotificationClear');
      this.submitting = true;
      $.ajax({
        url: '/api/apps/' + encodeURIComponent(this.app.name) + '/routes/' + encodeURIComponent(this.route.path),
        method: 'PATCH',
        data: JSON.stringify(this.route),
        contentType: "application/json",
        dataType: 'json',
        success: (res) => {
          console.log("res", res);
          eventBus.$emit('RouteUpdated', t.route);
          t.submitting = false;
          t.closed();
        },
        error: function(jqXHR, textStatus, errorThrown){
          t.submitting = false;
          defaultErrorHander(jqXHR);
        }
      })
    },
  },
  created:  function (){
    eventBus.$on('openEditRoute', (route) => {
      this.route = jQuery.extend(true, {}, route);
      this.show = true;
    });
  }
}
</script>