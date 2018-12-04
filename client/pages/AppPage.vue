<template>
  <div>
    <ol class="breadcrumb">
      <li><router-link to="/">Apps</router-link>      </li>
      <li class="active">{{app.name}}</li>
    </ol>
    <br />


    <h1 class="page-header">
      {{app.name}}

      <div class="pull-right">
        <button class="btn btn-default" @click="openAddRoute()"><i class="fa fa-plus"></i> Add Route</button>
      </div>
    </h1>

    <br />

    <!-- <div class="table-responsive"> -->
    <div class="row">
      <div class="col-md-12 col-lg-10">
        <table class="table table-striped">
          <thead v-bind:class="{ transparent: fns.length == 0 }">
            <th>Path</th>
            <th>Image</th>
            <th>Type</th>
            <th>Memory</th>
            <th>MaxCC</th>
            <th>Timeout</th>
            <th width="140">Actions</th>
          </thead>
          <tbody>
            <tr v-for="fn in fns">
              <td>{{fn.path}}</td>
              <td>{{fn.image}}</td>
              <td>{{fn.type}}</td>
              <td>{{fn.memory}} MB</td>
              <td>{{fn.max_concurrency}}</td>
              <td>{{fn.timeout}}</td>
              <td>
                <div class="toolbar">

                  <div class="btn-group">
                    <button class="btn btn-default btn-sm" @click.prevent="openRunFunction(route)" title="Run Function"><i class="fa fa-play"></i> Run Function</button>
                    <button type="button" class="btn btn-default dropdown-toggle btn-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <span class="caret"></span>
                      <span class="sr-only">Toggle Dropdown</span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right">
                      <li>
                        <a href="#" @click.prevent="openEditRoute(route)" title="Edit Route">
                          <i class="fa fa-gear"></i> Edit Route
                        </a>
                        <a href="#" @click.prevent="deleteRoute(route)"
                        class="text-danger" title="Delete Route">
                          <i class="fa fa-times"></i> Delete Route
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="fnsLoaded && fns.length == 0">
              <td colspan="99" class="no-matches">
                <div>
                  No Functions
                </div>
              </td>
            </tr>
            <tr v-if="!fnsLoaded">
              <td colspan="99" class="no-matches">
                <div>Loading...</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <h3 class="page-header">
      Statistics
      <div class="pull-right">
        <label class="btn btn-default checkbox-inline" style="padding-left:30px"><!-- TODO style this properly -->
          <input type="checkbox" v-model="isChecked" @change="appPageAutoRefreshButtonClicked">Auto refresh</label>
        </label>
      </div>
    </h3>
            
    <stats-chart :fns="fns" :stats="stats" :statshistory="statshistory" :appname="appname"></stats-chart>

    <fn-route-form :app="app"></fn-route-form>
    <fn-run-function :app="app"></fn-run-function>
  </div>
</template>

<script>
//import Modal from '../lib/vue-bootstrap-modal.vue';
import FnRouteForm from '../components/FnRouteForm';
import FnRunFunction from '../components/FnRunFunction';
import StatsChart from '../components/StatsChart'
import { eventBus } from '../client';
import { defaultErrorHandler, getAuthToken } from '../lib/helpers';

export default {
  props: ['apps','stats','statshistory','autorefresh'],
  data: function(){
    return {
      app: {},
      id: "",
      fns: [],
      fnsLoaded: false,
      isChecked: true,
      appname: "",
    }
  },
  components: {
    FnRouteForm,
    StatsChart,
    FnRunFunction
  },
  methods: {
    appPageAutoRefreshButtonClicked: function(checkboxElem) {
      if (checkboxElem.currentTarget.checked) {
        eventBus.$emit('startAutoRefreshStats');
      } else {
        eventBus.$emit('stopAutoRefreshStats');
      }
    }, 
    openAddRoute: function(){
      eventBus.$emit('openAddRoute');
    },
    openEditRoute: function(route){
      eventBus.$emit('openEditRoute', route);
    },
    openRunFunction: function(route){
      eventBus.$emit('openRunFunction', route);
    },
    loadFns: function(){
      var t = this;
      $.ajax({
        headers: {'Authorization': getAuthToken()},
        url: '/api/fns?app_id=' + encodeURIComponent(t.app.id),
        dataType: 'json',
        success: function(fns){
          t.fns = fns;
          t.fnsLoaded = true;
        },
        error: defaultErrorHandler
      })
    },
    loadApp: function(appID, cb){
      var t = this;
      $.ajax({
        headers: {'Authorization': getAuthToken()},
        url: '/api/apps/' + encodeURIComponent(appID),
        dataType: 'json',
        success: (app) => {t.app = app; if (cb) {cb()} },
        error: defaultErrorHandler
      })
    },
    deleteRoute: function(route){
      if (confirm('Are you sure you want to delete route ' + route.path + '?')) {
        var t = this;
        $.ajax({
          headers: {'Authorization': getAuthToken()},
          url: '/api/apps/' + encodeURIComponent(t.app.name) + '/routes/' + encodeURIComponent(route.path),
          method: 'DELETE',
          dataType: 'json',
          success: (app) => { t.loadFns() },
          error: defaultErrorHandler
        })
      }
    },
    setTitle: function(){
      document.title = this.app.name + " | Functions UI";
    },
    appLoaded: function(){
      this.appname=this.app.name;
      this.id=this.app.id;
      this.fns = [];
      this.fnsLoaded = false;
      this.loadFns();
      this.setTitle();
      eventBus.$emit('AppOpened', this.app);
    },
    appSwitched: function(){
      this.loadApp(this.$route.params.appname, () => { this.appLoaded(); });
    }
  },
  watch: {
    '$route': 'appSwitched'
  },
  beforeRouteEnter (to, from, next) {
    // access to component instance via `vm`
    next(vm => {
      if (vm.apps){
        vm.app = _.find(vm.apps, (app) => {return app.name == to.params.appname});
        vm.appLoaded();
      } else {
        vm.loadApp(to.params.appname, () => { vm.appLoaded(); });
      }
    })
  },
  destroyed: function(){
    eventBus.$emit('AppClosed');
  },
  created:  function (){
    eventBus.$on('RouteAdded', (route) => {
      this.loadFns()
    });
    eventBus.$on('RouteUpdated', (route) => {
      this.loadFns()
    });
    this.isChecked=this.autorefresh;
    if (this.autorefresh) {
      eventBus.$emit('startAutoRefreshStats');
    }
  }
}
</script>

<style>

</style>
