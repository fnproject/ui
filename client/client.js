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

const numXValues = 50;

const router = new VueRouter({
  routes: [
    { path: '/', component: IndexPage },
    { path: '/app/:appname', component: AppPage }
  ]
});

// factory for background colors; simply iterate round these arrays of colors
//const backgroundColors = ['pink','lightgreen','yellow'];
const backgroundColors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 
                          'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)' ];
const borderColors = ['rgba(255,99,132,1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 
                      'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'];
var backgroundColorMap = {}
var borderColorMap = {}

export function getBackgroundColorFor(path){
  if (!backgroundColorMap[path]){
     backgroundColorMap[path]=backgroundColors[(Object.keys(backgroundColorMap).length) % (backgroundColors.length)];
  }
  return backgroundColorMap[path];
}
export function getBorderColorFor(path){
  if (!borderColorMap[path]){
     borderColorMap[path]=borderColors[(Object.keys(borderColorMap).length) % (borderColors.length)];
  }
  return borderColorMap[path];
}

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
      for (var i = 0; i < numXValues; i++) {
      	this.statshistory.push(
      	  {
      	    Queue: 0,
      	    Running: 0,
      	    Complete: 0,
      	    FunctionStatsMap: {}
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
            if (t.statshistory.length > numXValues){
              t.statshistory.shift();
            }
          }        
          
          // do the stats contain a new function?
          var previousKnownFunctions = Object.keys(t.statshistory[t.statshistory.length-2].FunctionStatsMap);
          var nowKnownFunctions = Object.keys(t.statshistory[t.statshistory.length-1].FunctionStatsMap);
          for (var j = 0; j < nowKnownFunctions.length; j++){
            if (previousKnownFunctions.indexOf(nowKnownFunctions[j])==-1){
              var newFunction = nowKnownFunctions[j];
              // we have a new function: backfill all the earlier stats with zero values for this function
              for (var k = 0; k < t.statshistory.length-1; k++){
                t.statshistory[k].FunctionStatsMap[newFunction]={Queue:0, Running:0, Complete:0};
              }
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
