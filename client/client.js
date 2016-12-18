require("./css/app.css");

require('expose?$!expose?jQuery!jquery');
import _ from 'lodash/core';

import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import IndexPage from './pages/IndexPage.vue';
import AppPage from './pages/AppPage.vue';

import FnSidebar from './components/FnSidebar.vue';

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
    //VueRouter
  },
  mounted: function () {
    var t = this;
    $.ajax({
      url: '/api/apps',
      dataType: 'json',
      success: (apps) => t.apps = apps,
      error: function(jqXHR, textStatus, errorThrown){
        console.log("error", jqXHR, textStatus, errorThrown)
      }
    })
  }
}).$mount('#app')


//console.log("client initialized");
