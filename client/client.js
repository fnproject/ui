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
  $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('red');

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
