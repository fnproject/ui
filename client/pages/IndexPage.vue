<template>
  <div>
    <br />
    <ol class="breadcrumb">
      <li class="active">Apps</li>
    </ol>

    <div class="pull-right">
      <button class="btn btn-default" @click="openAddApp"><i class="fa fa-plus"></i> Add App</button>
    </div>

    <br />
    <br />

    <table class="table">
      <thead>
        <th>Name</th>
        <th width="120">Actions</th>
      </thead>
      <tbody>
        <tr v-for="app in apps">
          <td>
            <router-link :to="'/app/' + encodeURIComponent(app.name)">{{app.name}}</router-link>
          </td>
          <td>
            <div class="toolbar">
              <button class="btn btn-default" @click="openEditApp(app)" title="Edit App"><i class="fa fa-gear"></i></button>
              <button class="btn btn-default" @click="deleteApp(app)" title="Delete App"><i class="fa fa-times"></i></button>
            </div>
          </td>
        </tr>
        <tr v-if="apps && apps.length == 0">
          <td colspan="99" class="no-matches"><div>No Apps</div></td>
        </tr>
      </tbody>
    </table>

    <!-- <pre>{{ JSON.stringify($data, null, 2) }}</pre> -->

    <fn-app-form></fn-app-form>
  </div>
</template>

<script>
import FnAppForm from '../components/FnAppForm';
import { defaultErrorHandler } from '../lib/helpers';
import { eventBus } from '../client';

export default {
  props: ['apps'],
  components: {
    FnAppForm
  },
  methods: {
    openAddApp: function(){
      eventBus.$emit('openAddApp');
    },
    openEditApp: function(app){
      eventBus.$emit('openEditApp', app);
    },
    deleteApp: function(app){
      if (confirm('Are you sure you want to delete app ' + app.name + '?')) {
        var t = this;
        $.ajax({
          url: '/api/apps/' + encodeURIComponent(app.name),
          method: 'DELETE',
          dataType: 'json',
          success: (app) => { eventBus.$emit('AppDeleted', app) },
          error: defaultErrorHandler
        })
      }
    }
  },
  created: function (){
    document.title = "Functions UI"
  }
}
</script>

<style>

</style>
