<template>
  <div>
    <br />
    <ol class="breadcrumb">
      <li><router-link to="/">Apps</router-link>      </li>
      <li class="active">{{app.name}}</li>
    </ol>

    <h3>{{app.name}}</h3>
    <br />

    <!-- <pre>{{ JSON.stringify(routes, null, 2) }}</pre> -->
    <div class="pull-right">
      <button class="btn btn-default" @click="openAddRoute()"><i class="fa fa-plus"></i> Add Route</button>
    </div>

    <table class="table">
      <thead>
        <th>Path</th>
        <th>Image</th>
        <th>Type</th>
        <th>Memory</th>
        <th>MaxCC</th>
        <th>Timeout</th>
        <th width="100">Actions</th>
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
            <!-- Not implemented on api side -->
            <button class="btn btn-default" @click="openEditRoute(route)"><i class="fa fa-gear"></i></button>
            <button class="btn btn-default" @click="deleteRoute(route)"><i class="fa fa-times"></i></button>
          </td>
        </tr>
        <tr v-if="routes && routes.length == 0">
          <td colspan="99" class="no-matches"><div>No Routes</div></td>
        </tr>
      </tbody>
    </table>



    <fn-add-route :app="app"></fn-add-route>
    <fn-edit-route :app="app"></fn-edit-route>

  </div>
</template>

<script>
//import Modal from '../lib/vue-bootstrap-modal.vue';
import FnAddRoute from '../components/FnAddRoute';
import FnEditRoute from '../components/FnEditRoute';
import { eventBus } from '../client';
import { defaultErrorHander } from '../lib/helpers';

export default {
  props: ['apps'],
  data: function(){
    return {
      app: {},
      routes: []
    }
  },
  components: {
    FnAddRoute,
    FnEditRoute
  },
  methods: {
    openAddRoute: function(){
      eventBus.$emit('openAddRoute');
    },
    openEditRoute: function(route){
      eventBus.$emit('openEditRoute', route);
    },
    loadRoutes: function(){
      var t = this;
      $.ajax({
        url: '/api/apps/' + encodeURIComponent(t.app.name) + '/routes',
        dataType: 'json',
        success: (routes) => t.routes = routes,
        error: defaultErrorHander
      })
    },
    loadApp: function(name, cb){
      var t = this;
      $.ajax({
        url: '/api/apps/' + encodeURIComponent(name),
        dataType: 'json',
        success: (app) => {t.app = app; if (cb) {cb()} },
        error: defaultErrorHander
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
          error: defaultErrorHander
        })
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    // access to component instance via `vm`
    next(vm => {
      if (vm.apps){
        vm.app = _.find(vm.apps, (app) => {return app.name == to.params.appname});
        vm.loadRoutes()
      } else {
        vm.loadApp(to.params.appname, () => { vm.loadRoutes() });
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
