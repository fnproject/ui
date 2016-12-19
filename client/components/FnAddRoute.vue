<template>
  <modal title="Add Route" :show="show" @closed="closed" @ok="ok" @cancel="closed">
    <form class="form-horizontal" v-on:submit.prevent="ok()">
      <div class="form-group">
        <label class="col-sm-3 control-label">Path *</label>
        <div class="col-sm-9">
          <input type="text" class="form-control" placeholder="e.g. /hello" v-model="route.path" required>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">Image *</label>
        <div class="col-sm-9">
          <input type="text" class="form-control" placeholder="e.g. iron/hello"  v-model="route.image" required>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">Type</label>
        <div class="col-sm-9">
          <label class="radio-inline"><input type="radio" value="sync" v-model="route.type"> Sync</label>
          <label class="radio-inline"><input type="radio" value="async" v-model="route.type"> Async</label>
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">Memory, MB</label>
        <div class="col-sm-9">
          <input type="number" class="form-control" placeholder="e.g. 128"  v-model="route.memory">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">Max Concurrency</label>
        <div class="col-sm-9">
          <input type="number" class="form-control" placeholder="e.g. 100"  v-model="route.max_concurrency">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">Timeout, sec</label>
        <div class="col-sm-9">
          <input type="number" class="form-control" placeholder="e.g. 60"  v-model="route.timeout">
        </div>
      </div>
    </form>

    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="ok" :disabled="submitting">Create</button>
    </div>
  </modal>
</template>

<script>
import Modal from '../lib/VueBootstrapModal.vue';
import { eventBus } from '../client';
import { defaultErrorHander } from '../lib/helpers';

var defaultRoute = function(){
  return jQuery.extend(true, {}, {
    path: "",
    image: "",
    type: "sync",
    memory: 128
  });
}

export default {
  props: ['app'],
  components: {
    Modal
  },
  data: function(){
    return {
      show: false,
      submitting: false,
      route: defaultRoute()
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
        url: '/api/apps/' + encodeURIComponent(this.app.name) + '/routes',
        method: 'POST',
        data: JSON.stringify(this.route),
        contentType: "application/json",
        dataType: 'json',
        success: (res) => {
          eventBus.$emit('RouteAdded', res.route);
          t.submitting = false;
          t.closed();
          t.route = defaultRoute();
        },
        error: function(jqXHR, textStatus, errorThrown){
          t.submitting = false;
          defaultErrorHander(jqXHR);
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