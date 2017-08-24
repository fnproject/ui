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
import { defaultErrorHandler, getAuthToken } from './lib/helpers';

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
    apps: null,
    stats: null,
    statshistory: null
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
        headers: {'Authorization': getAuthToken()},
        url: '/api/apps',
        dataType: 'json',
        success: (apps) => t.apps = apps,
        error: defaultErrorHandler
      })
    },
    initialiseStatshistory: function(){
      this.statshistory = [];
      for (var i = 0; i < 50; i++) {
      	this.statshistory.push(
      	  {
      	    Queue: 0,
      	    Runnning: 0,
      	    Complete: 0
      	  }      	  
      	)
      } 
    },    
    loadStats: function(){
      var t = this;
      $.ajax({
        url: '/api/stats',
        dataType: 'json',
        success: (statistics) => {
          t.stats = statistics;
          if (t.statshistory==null){
            t.statshistory = [statistics];
          } else {
            t.statshistory.push(statistics);
            if (t.statshistory.length > 50){
              t.statshistory.shift();
            }
          }
          // we have new stats: notify any graphs to update themselves 
          eventBus.$emit('statsRefreshed');
        },
        error: defaultErrorHandler
      })
    }
  },
  created: function(){
    var timer;
    this.initialiseStatshistory();
    this.loadApps();
    this.loadStats();
    // handle "refresh button pressed"
    eventBus.$on('refreshStats', (app) => {
      this.loadStats();
    });    
    eventBus.$on('startAutoRefreshStats', (app) => {
      timer = setInterval(function () {
        this.loadStats();
      }.bind(this), 1000); 
    });  
    eventBus.$on('stopAutoRefreshStats', (app) => {
      clearInterval(timer);
    });      
    eventBus.$on('AppAdded', (app) => {
      this.loadApps();
      this.loadStats();
    });
    eventBus.$on('AppUpdated', (app) => {
      this.loadApps();
      this.loadStats();
    });
    eventBus.$on('AppDeleted', (app) => {
      this.loadApps();
      this.loadStats();
    });
    eventBus.$on('LoggedIn', () => {
      this.loadApps()
    });
  }
}).$mount('#app')


//console.log("client initialized");
