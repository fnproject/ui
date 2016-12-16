<template>
  <div>
    <br />
    <ol class="breadcrumb">
      <li><router-link to="/">Apps</router-link>      </li>
      <li class="active">App!</li>
    </ol>

    <br />
    <br />

    app!


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
