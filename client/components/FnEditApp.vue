<template>
  <modal title="Edit App" :show="show" @closed="closed" @ok="ok" @cancel="closed">
      <form class="form-horizontal" v-on:submit.prevent="ok">
        <div class="form-group">
          <label class="col-sm-2 control-label">Name</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" placeholder="e.g. my-app" v-model="app.name" required disabled>
          </div>
        </div>
      </form>

      <div slot="footer">
        <button type="button" class="btn btn-primary" @click="ok">Save</button>
      </div>
    </modal>
</template>

<script>
import Modal from '../lib/VueBootstrapModal.vue';
import { eventBus } from '../client';
import { defaultErrorHander } from '../lib/helpers';

export default {
  props: [],
  components: {
    Modal
  },
  data: function(){
    return {
      show: false,
      app: {},
      originalName: ""
    }
  },
  methods: {
    closed: function(){
      this.show = false;
    },
    ok: function(){
      var t = this;
      eventBus.$emit('NotificationClear');
      $.ajax({
        url: '/api/apps/' + encodeURIComponent(this.originalName),
        method: 'PATCH',
        data: JSON.stringify(this.app),
        contentType: "application/json",
        dataType: 'json',
        success: (res) => {
          eventBus.$emit('AppUpdated', res.app);
          t.closed();
          t.app = {};
        },
        error: defaultErrorHander
      })
    },
  },
  created: function (){
    eventBus.$on('openEditApp', (app) => {
      this.app = jQuery.extend(true, {}, app);
      this.originalName = app.name;
      this.show = true;
    });
  }
}
</script>