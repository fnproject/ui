console.log("loading .... ");

// require('expose?$!expose?jQuery!jquery');

var _ = require('lodash/core');

require('expose?angular!angular');
require('expose?angular-resource!angular-resource');

require('expose?angular-aria!angular-aria');
require('expose?angular-sanitize!angular-sanitize');
require('expose?angular-animate!angular-animate');
require('expose?angular-messages!angular-messages');
require('expose?angular-route!angular-route');

// Using vendored version. don't work well with expose
//require('expose?angular-material!angular-material');
require('./vendor/angular-material');

require("./css/app.css");

var titan = angular
            .module('Titan', ['ngResource', 'ngMaterial', 'ngSanitize', 'ngMessages', 'ngRoute'])
            .config(function($mdThemingProvider, $mdIconProvider, $routeProvider){
  var customPrimary = {
      '50': '#25bcff',
      '100': '#0cb4ff',
      '200': '#00a7f1',
      '300': '#0095d8',
      '400': '#0084be',
      '500': '#0072A5',
      '600': '#00608b',
      '700': '#004f72',
      '800': '#003d58',
      '900': '#002c3f',
      'A100': '#3fc4ff',
      'A200': '#58ccff',
      'A400': '#72d3ff',
      'A700': '#001a25'
  };
  $mdThemingProvider
      .definePalette('customPrimary',
                      customPrimary);

  var customAccent = {
      '50': '#664701',
      '100': '#7f5902',
      '200': '#986b02',
      '300': '#b17c02',
      '400': '#cb8e02',
      '500': '#e4a003',
      '600': '#fcb91d',
      '700': '#fdc136',
      '800': '#fdc850',
      '900': '#fdd069',
      'A100': '#fcb91d',
      'A200': '#FCB104',
      'A400': '#e4a003',
      'A700': '#fed882'
  };
  $mdThemingProvider
      .definePalette('customAccent',
                      customAccent);

  var customWarn = {
      '50': '#f0aba0',
      '100': '#ed988a',
      '200': '#e98474',
      '300': '#e6715e',
      '400': '#e25d48',
      '500': '#DF4A32',
      '600': '#d63a21',
      '700': '#c0341e',
      '800': '#aa2e1b',
      '900': '#942817',
      'A100': '#f4bfb6',
      'A200': '#f7d2cc',
      'A400': '#fbe6e2',
      'A700': '#7e2214'
  };
  $mdThemingProvider
      .definePalette('customWarn',
                      customWarn);

  var customBackground = {
      '50': '#ffffff',
      '100': '#ffffff',
      '200': '#ffffff',
      '300': '#f5f7f8',
      '400': '#e7ebed',
      '500': '#D8DFE2',
      '600': '#c9d3d7',
      '700': '#bbc7cc',
      '800': '#acbbc1',
      '900': '#9dafb6',
      'A100': '#ffffff',
      'A200': '#ffffff',
      'A400': '#ffffff',
      'A700': '#8fa3ac'
  };
  $mdThemingProvider
      .definePalette('customBackground',
                      customBackground);

  $mdThemingProvider.theme('default')
     .primaryPalette('customPrimary')
     .accentPalette('customAccent')
     .warnPalette('customWarn')
     .backgroundPalette('customBackground');

  $routeProvider.when("/", {
    activePage: 'main',
    templateUrl: '/templates/main.tmpl.html'
  }).when("/groups/:group_name", {
    activePage: 'jobs',
    templateUrl: '/templates/jobs.tmpl.html',
    controller: 'GroupJobsController'
  }).otherwise({redirectTo:'/'});
});

require('./services/group');
require('./services/job');

require('./controllers/ParentCtrl');
require('./controllers/ParentDialogCtrl');

require('./controllers/NewGroupDialogController');
require('./controllers/NewJobDialogController');
require('./controllers/EditGroupDialogController');
require('./controllers/GroupJobsController');

require('./controllers/IndexController');


console.log("client initialized");
