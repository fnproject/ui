<template>
  <div>
    <br />
    <ol class="breadcrumb">
      <li class="active">Apps</li>
    </ol>

    <br />
    <br />


    <table class="table">
      <thead>
        <th>Name</th>
        <th>Actions</th>
      </thead>
      <tbody>
        <tr v-for="app in apps">
          <td>
            <router-link :to="'/app/' + encodeURIComponent(app.name)">{{app.name}}</router-link>
          </td>
          <td>
            <span class="fa fa-plus"></span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- <pre>{{ JSON.stringify($data, null, 2) }}</pre> -->


  </div>
</template>

<script>

  export default {
    props: ['apps'],
    components: {

    },
    methods: {
      btnClicked: function(){
        console.log("!1", this.$data);
        console.log("!2", this.$root.$data);
        console.log("!3", this.apps);
      }
    }
  }
</script>

<style>

</style>
