<template>
  <modal title="Add App" :show="show" @closed="closed" @ok="ok" @cancel="closed">
    <form class="form-horizontal" v-on:submit.prevent="ok">
      <div class="form-group">
        <label class="col-sm-2 control-label">Name</label>
        <div class="col-sm-10">
          <input type="text" class="form-control" placeholder="e.g. my-app" v-model="app.name" required>
        </div>
      </div>
    </form>

    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="ok">Create</button>
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
      app: {}
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
        url: '/api/apps',
        method: 'POST',
        data: JSON.stringify(this.app),
        contentType: "application/json",
        dataType: 'json',
        success: (res) => {
          eventBus.$emit('AppAdded', res.app);
          t.closed();
          t.app = {};
        },
        error: defaultErrorHander
      })
    },
  },
  created:  function (){
    eventBus.$on('openAddApp', () => {
      this.show = true;
    });
  }
}
</script>