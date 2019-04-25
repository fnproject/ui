<template>
  <modal :title="title()" :show="show" @closed="closed" @ok="ok" @cancel="closed">
    <form class="form-horizontal" v-on:submit.prevent="ok">
      <div class="form-group">
        <label class="col-sm-3 control-label">Name</label>
        <div class="col-sm-9">
          <input type="text" class="form-control" placeholder="e.g. my-app" v-model="app.name" required :disabled="edit" @keydown.enter.prevent="">
        </div>
      </div>

      <hr>
      <fn-config-form :config="appConfig"></fn-config-form>

    </form>

    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="ok">{{okBtnName()}}</button>
    </div>
  </modal>
</template>

<script>
import Modal from '../lib/VueBootstrapModal.vue';
import FnConfigForm from '../components/FnConfigForm';
import { eventBus } from '../client';
import { defaultErrorHandler, configToLines, linesToConfig, getAuthToken } from '../lib/helpers';

export default {
  props: [],
  components: {
    Modal,
    FnConfigForm,
  },
  data: function(){
    return {
      show: false,
      edit: false,
      app: {},
      appConfig: [{key: "", value: ""}]
    }
  },
  methods: {
    title: function(){
      return this.edit ? 'Edit App' : 'Create New App';
    },
    okBtnName: function(){
      return this.edit ? 'Save Changes' : 'Create App';
    },
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
      if (this.edit) {
        var url = '/api/apps/' + encodeURIComponent(this.app.id);
      } else {
        var url = '/api/apps';
      };
      $.ajax({
        headers: {'Authorization': getAuthToken()},
        url: url,
        method: this.edit ? 'PUT' : 'POST',
        data: JSON.stringify(this.app),
        contentType: "application/json",
        dataType: 'json',
        success: (res) => {
          if (this.edit){
            eventBus.$emit('AppUpdated', res.app);
          } else {
            eventBus.$emit('AppAdded', res.app);
          }
          t.closed();
          t.app = {};
        },
        error: defaultErrorHandler
      })
    },
  },
  created: function (){
    eventBus.$on('openEditApp', (app) => {
      this.app = jQuery.extend(true, {}, app);
      this.appConfig = configToLines(app.config)
      this.edit = true;
      this.show = true;
    });
    eventBus.$on('openAddApp', () => {
      this.app = {};
      this.appConfig = configToLines({});
      this.edit = false;
      this.show = true;
    });
  }
}
</script>
