<template>
  <div>

    <a class="fn-logo navbar-brand" href="#">
        <!-- See also banner for small devices in index.html -->
        <div class="fn-logo">FN</div>
    </a>
    <div>
    <div v-if="!loggedIn">
        <button type="button" class="btn" @click='login' :disabled="loggingin">
            Login
        </button>
        <input type="text" placeholder="FN_TOKEN" v-model="fn_token"></input>
    </div>
    <button type="button" class="btn" v-if="loggedIn" @click='logout'>
        Logout
    </button>
</div>

    <ul class="nav nav-sidebar" v-if="app">
      <li :class="{active: app && app.name == a.name}"  v-for="a in apps">
        <router-link :to="'/app/' + encodeURIComponent(a.name)">
          {{a.name}}
          <span class="sr-only" v-if="app && app.name == a.name">(current)</span>
        </router-link>
      </li>
    </ul>


    <fn-welcome-section v-if="!app"></fn-welcome-section>
  </div>
</template>

<script>
  import { eventBus } from '../client';
  import FnWelcomeSection from '../components/FnWelcomeSection';
  import { getAuthToken, defaultErrorHandler } from '../lib/helpers';

  export default {
    props: ['apps'],
    data: function(){
      return {
        app: null,
        loggedIn: (window.localStorage.FN_TOKEN !== "" && window.localStorage.FN_TOKEN !== undefined),
        loggingin: false,
        fn_token: ""
      }
    },
    methods: {
        login: function(){
            var t = this
            t.loggingin = true
            $.ajax({
              headers: {'Authorization': 'Bearer '+t.fn_token},
              url: '/api/apps/',
              method: 'GET',
              contentType: "application/json",
              dataType: 'json',
              success: (res) => {
                t.loggingin = false;
                window.localStorage.setItem('FN_TOKEN','Bearer '+t.fn_token);
                t.fn_token = "";
                eventBus.$emit('LoggedIn');
                eventBus.$emit('NotificationClear');
              },
              error: function(jqXHR, textStatus, errorThrown){
                t.loggingin = false;
                t.fn_token = "";
                defaultErrorHandler(jqXHR);
              }
            })
        },
        logout: function(){
            window.localStorage.removeItem('FN_TOKEN')
            eventBus.$emit('LoggedOut');
        }
    },
    components: {
      FnWelcomeSection
    },
    created:  function (){
      eventBus.$on('AppOpened', (app) => {
        this.app = app;
      });
      eventBus.$on('AppClosed', () => {
        this.app = null;
      });
      eventBus.$on('LoggedOut', () => {
        this.loggedIn = false;
      });
      eventBus.$on('LoggedIn', () => {
        this.loggedIn = true;
      });
    }
  }
</script>

<style>

</style>
