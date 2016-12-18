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

    <table class="table">
      <thead>
        <th>Path</th>
        <th>Image</th>
        <th>Memory</th>
        <th>Type</th>
        <th>Actions</th>
      </thead>
      <tbody>
        <tr v-for="route in routes">
          <td>{{route.path}}</td>
          <td>{{route.image}}</td>
          <td>{{route.memory}} MB</td>
          <td>{{route.type}}</td>
          <td>
            <span class="fa fa-plus"></span>?
          </td>
        </tr>
        <tr v-if="routes && routes.length == 0">
          <td colspan="99" class="no-matches"><div>No Routes</div></td>
        </tr>
      </tbody>
    </table>



  </div>
</template>

<script>

  export default {
    props: ['apps'],
    data: function(){
      return {
        app: {},
        routes: []
      }
    },
    components: {

    },
    methods: {
      btnClicked: function(){
        console.log("!1", this.$data);
        console.log("!2", this.$root.$data);
        console.log("!3", this.apps);
      },
      loadRoutes: function(){
        var t = this;
        $.ajax({
          url: '/api/apps/' + encodeURIComponent(t.app.name) + '/routes',
          dataType: 'json',
          success: (routes) => t.routes = routes,
          error: function(jqXHR, textStatus, errorThrown){
            console.log("error", jqXHR, textStatus, errorThrown)
          }
        })
      },
      loadApp: function(name, cb){
        var t = this;
        $.ajax({
          url: '/api/apps/' + encodeURIComponent(name),
          dataType: 'json',
          success: (app) => {t.app = app; if (cb) {cb()} },
          error: function(jqXHR, textStatus, errorThrown){
            console.log("error", jqXHR, textStatus, errorThrown)
          }
        })
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
    }
  }
</script>

<style>

</style>
