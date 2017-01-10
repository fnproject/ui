require("./css/app.css");

require('expose?$!expose?jQuery!jquery');
require("bootstrap/dist/js/bootstrap.min");

import _ from 'lodash/core';

import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import IndexPage from './pages/IndexPage.vue';
import AppPage from './pages/AppPage.vue';

import FnSidebar from './components/FnSidebar.vue';
import FnNotification from './components/FnNotification.vue';
import { defaultErrorHandler } from './lib/helpers';

export const eventBus = new Vue();

const router = new VueRouter({
  routes: [
    { path: '/', component: IndexPage },
    { path: '/app/:appname', component: AppPage }
  ]
});

new Vue({
  router: router,
  data: {
    apps: null
  },
  components: {
    IndexPage,
    FnSidebar,
    FnNotification
  },
  methods: {
    loadApps: function(){
      var t = this;
      $.ajax({
        url: '/api/apps',
        dataType: 'json',
        success: (apps) => t.apps = apps,
        error: defaultErrorHandler
      })
    }
  },
  created: function(){
    this.loadApps();
    eventBus.$on('AppAdded', (app) => {
      this.loadApps()
    });
    eventBus.$on('AppUpdated', (app) => {
      this.loadApps()
    });
    eventBus.$on('AppDeleted', (app) => {
      this.loadApps()
    });
  }
}).$mount('#app')


//console.log("client initialized");
