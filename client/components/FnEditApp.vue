<template>
  <modal title="Edit App" :show="show" @closed="closed" @ok="ok" @cancel="closed">
    <form class="form-horizontal" v-on:submit.prevent="ok">
      <div class="form-group">
        <label class="col-sm-3 control-label">Name</label>
        <div class="col-sm-9">
          <input type="text" class="form-control" placeholder="e.g. my-app" v-model="app.name" required disabled>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-3 control-label">Config</label>
        <div class="col-sm-9">
          <div class="row" v-for="(line, index) in appConfig">
            <div class="col-sm-5 cfg-key">
              <input type="text" class="form-control" placeholder="Key" v-model="line.key">
            </div>
            <div class="col-sm-5 cfg-val">
              <input type="text" class="form-control" placeholder="Value" v-model="line.value">
            </div>
            <div class="col-sm-1">
              <button class="btn btn-default" @click.prevent="removeConfigLine(index)"><i class="fa fa-times"></i></button>
            </div>
          </div>
          <a href="#" class="pull-right" @click.prevent="addConfigLine">Add line</a>
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
import { defaultErrorHander, configToLines, linesToConfig } from '../lib/helpers';

export default {
  props: [],
  components: {
    Modal
  },
  data: function(){
    return {
      show: false,
      app: {},
      appConfig: [{key: "", value: ""}]
    }
  },
  methods: {
    closed: function(){
      this.show = false;
    },
    addConfigLine: function(){
      this.appConfig.push({key: "", value: ""});
    },
    removeConfigLine: function(index){
      this.appConfig.splice(index, 1)
    },
    ok: function(){
      var t = this;
      eventBus.$emit('NotificationClear');
      this.app.config = linesToConfig(this.appConfig);

      $.ajax({
        url: '/api/apps/' + encodeURIComponent(this.app.name),
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
      this.appConfig = configToLines(app.config)
      this.show = true;
    });
  }
}
</script>

<style scoped>
 .cfg-key {
   padding: 0 5px 5px 15px;
 }
 .cfg-val {
   padding: 0 5px 5px 5px;
 }

</style>