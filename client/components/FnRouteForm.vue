<template>
  <modal :title="title()" :show="show" @closed="closed" @ok="ok" @cancel="closed">
    <form class="form-horizontal" v-on:submit.prevent="ok">
      <div class="form-group">
        <label class="col-sm-3 control-label">Path *</label>
        <div class="col-sm-9">
          <input type="text" class="form-control" placeholder="e.g. /hello" v-model="route.path" :disabled="edit">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">Image *</label>
        <div class="col-sm-9">
          <input type="text" class="form-control" placeholder="e.g. iron/hello"  v-model="route.image">
        </div>
      </div>
      <div class="form-group">
        <label class="col-sm-3 control-label">Type</label>
        <div class="col-sm-9">
          <label class="radio-inline"><input type="radio" value="sync" name="type" v-model="route.type"> Sync</label>
          <label class="radio-inline"><input type="radio" value="async" name="type" v-model="route.type"> Async</label>
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
      <div class="form-group">
        <label class="col-sm-3 control-label">Config</label>
        <div class="col-sm-9">
          <div class="row" v-for="(line, index) in routeConfig">
            <div class="col-sm-5 cfg-key">
              <input type="text" class="form-control" placeholder="Key" v-model="line.key">
            </div>
            <div class="col-sm-5 cfg-val">
              <input type="text" class="form-control" placeholder="Value" v-model="line.value">
            </div>
            <div class="col-sm-1 toolbar">
              <button class="btn btn-default" @click.prevent="removeConfigLine(index)"><i class="fa fa-times"></i></button>
            </div>
          </div>
          <a href="#" class="pull-right" @click.prevent="addConfigLine">Add line</a>
        </div>
      </div>

      <div class="form-group">
        <label class="col-sm-3 control-label">Headers</label>
        <div class="col-sm-9">
          <div class="row" v-for="(line, index) in routeHeaders">
            <div class="col-sm-5 cfg-key">
              <input type="text" class="form-control" placeholder="Key" v-model="line.key">
            </div>
            <div class="col-sm-5 cfg-val">
              <input type="text" class="form-control" placeholder="Value" v-model="line.value">
            </div>
            <div class="col-sm-1 toolbar">
              <button class="btn btn-default" @click.prevent="removeHeadersLine(index)"><i class="fa fa-times"></i></button>
            </div>
          </div>
          <a href="#" class="pull-right" @click.prevent="addHeadersLine">Add line</a>
        </div>
      </div>



    </form>

    <div slot="footer">
      <button type="button" class="btn btn-primary" @click="ok" :disabled="submitting">{{okBtnName()}}</button>
    </div>
  </modal>
</template>

<script>
import Modal from '../lib/VueBootstrapModal.vue';
import { eventBus } from '../client';
import { defaultErrorHandler, configToLines, linesToConfig, headersToLines, linesToHeaders } from '../lib/helpers';

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
      edit: false,
      show: false,
      submitting: false,
      route: {},
      routeConfig: [],
      routeHeaders: []
    }
  },
  methods: {
    title: function(){
      return this.edit ? 'Edit Route' : 'Add Route';
    },
    okBtnName: function(){
      return this.edit ? 'Save' : 'Create';
    },
    closed: function(){
      this.show = false;
    },
    addConfigLine: function(){
      this.routeConfig.push({key: "", value: ""});
    },
    removeConfigLine: function(index){
      this.routeConfig.splice(index, 1)
    },
    addHeadersLine: function(){
      this.routeHeaders.push({key: "", value: ""});
    },
    removeHeadersLine: function(index){
      this.routeHeaders.splice(index, 1)
    },
    ok: function(){
      var t = this;
      eventBus.$emit('NotificationClear');
      this.submitting = true;

      this.route.config = linesToConfig(this.routeConfig);
      this.route.headers = linesToHeaders(this.routeHeaders);

      if (this.edit){
        var url = '/api/apps/' + encodeURIComponent(this.app.name) + '/routes/' + encodeURIComponent(this.route.path)
      }else{
        var url = '/api/apps/' + encodeURIComponent(this.app.name) + '/routes'
      }
      $.ajax({
        url: url,
        method: this.edit ? 'PATCH' : 'POST',
        data: JSON.stringify(this.route),
        contentType: "application/json",
        dataType: 'json',
        success: (res) => {
          if (t.edit){
            eventBus.$emit('RouteUpdated', res.route);
          } else {
            eventBus.$emit('RouteAdded', res.route);
          }
          t.submitting = false;
          t.closed();
        },
        error: function(jqXHR, textStatus, errorThrown){
          t.submitting = false;
          defaultErrorHandler(jqXHR);
        }
      })
    },
  },
  created:  function (){
    eventBus.$on('openEditRoute', (route) => {
      this.route = jQuery.extend(true, {}, route);
      this.routeConfig = configToLines(route.config);
      this.routeHeaders = headersToLines(route.headers);
      this.edit = true;
      this.show = true;
    });
    eventBus.$on('openAddRoute', () => {
      this.route = defaultRoute();
      this.routeConfig = [{key: "", value: ""}];
      this.routeHeaders = [{key: "", value: ""}];
      this.edit = false;
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