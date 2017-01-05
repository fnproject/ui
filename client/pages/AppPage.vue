<template>
  <div>
    <br />
    <ol class="breadcrumb">
      <li><router-link to="/">Apps</router-link>      </li>
      <li class="active">{{app.name}}</li>
    </ol>

    <div class="pull-right">
      <button class="btn btn-default" @click="openAddRoute()"><i class="fa fa-plus"></i> Add Route</button>
    </div>

    <h3>{{app.name}}</h3>
    <br />

    <div class="table-responsive">

      <table class="table table-striped">
      <thead>
        <th>Path</th>
        <th>Image</th>
        <th>Type</th>
        <th>Memory</th>
        <th>MaxCC</th>
        <th>Timeout</th>
        <th width="140">Actions</th>
      </thead>
      <tbody>
        <tr v-for="route in routes">
          <td>{{route.path}}</td>
          <td>{{route.image}}</td>
          <td>{{route.type}}</td>
          <td>{{route.memory}} MB</td>
          <td>{{route.max_concurrency}}</td>
          <td>{{route.timeout}}</td>
          <td>
            <div class="toolbar">
              <button class="btn btn-default" @click="openRunFunction(route)" title="Run Function"><i class="fa fa-play"></i></button>
              <button class="btn btn-default" @click="openEditRoute(route)" title="Edit Route"><i class="fa fa-gear"></i></button>
              <button class="btn btn-default" @click="deleteRoute(route)" title="Delete Route"><i class="fa fa-times"></i></button>
            </div>
          </td>
        </tr>
        <tr v-if="routes && routes.length == 0">
          <td colspan="99" class="no-matches"><div>No Routes</div></td>
        </tr>
      </tbody>
    </table>

    </div>

    <fn-route-form :app="app"></fn-route-form>
    <fn-run-function :app="app"></fn-run-function>
  </div>
</template>

<script>
//import Modal from '../lib/vue-bootstrap-modal.vue';
import FnRouteForm from '../components/FnRouteForm';
import FnRunFunction from '../components/FnRunFunction';
import { eventBus } from '../client';
import { defaultErrorHandler } from '../lib/helpers';

export default {
  props: ['apps'],
  data: function(){
    return {
      app: {},
      routes: []
    }
  },
  components: {
    FnRouteForm,
    FnRunFunction
  },
  methods: {
    openAddRoute: function(){
      eventBus.$emit('openAddRoute');
    },
    openEditRoute: function(route){
      eventBus.$emit('openEditRoute', route);
    },
    openRunFunction: function(route){
      eventBus.$emit('openRunFunction', route);
    },
    loadRoutes: function(){
      var t = this;
      $.ajax({
        url: '/api/apps/' + encodeURIComponent(t.app.name) + '/routes',
        dataType: 'json',
        success: (routes) => t.routes = routes,
        error: defaultErrorHandler
      })
    },
    loadApp: function(name, cb){
      var t = this;
      $.ajax({
        url: '/api/apps/' + encodeURIComponent(name),
        dataType: 'json',
        success: (app) => {t.app = app; if (cb) {cb()} },
        error: defaultErrorHandler
      })
    },
    deleteRoute: function(route){
      if (confirm('Are you sure you want to delete route ' + route.path + '?')) {
        var t = this;
        $.ajax({
          url: '/api/apps/' + encodeURIComponent(t.app.name) + '/routes/' + encodeURIComponent(route.path),
          method: 'DELETE',
          dataType: 'json',
          success: (app) => { t.loadRoutes() },
          error: defaultErrorHandler
        })
      }
    },
    setTitle: function(){
      document.title = this.app.name + " | Functions UI";
    }
  },
  beforeRouteEnter (to, from, next) {
    // access to component instance via `vm`
    next(vm => {
      if (vm.apps){
        vm.app = _.find(vm.apps, (app) => {return app.name == to.params.appname});
        vm.loadRoutes();
        vm.setTitle();
      } else {
        vm.loadApp(to.params.appname, () => { vm.loadRoutes();vm.setTitle(); });
      }
    })
  },
  created:  function (){

    eventBus.$on('RouteAdded', (route) => {
      this.loadRoutes()
    });
    eventBus.$on('RouteUpdated', (route) => {
      this.loadRoutes()
    });
  }
}
</script>

<style>

</style>
