console.log("loading .... ");

// require('expose?$!expose?jQuery!jquery');

require('expose?angular!angular');
require('expose?angular-resource!angular-resource');

require('expose?angular-aria!angular-aria');
require('expose?angular-sanitize!angular-sanitize');
require('expose?angular-animate!angular-animate');
require('expose?angular-messages!angular-messages');

// Using vendored version. don't work well with expose
//require('expose?angular-material!angular-material');
require('./vendor/angular-material');

require("./css/app.css");

var titan = angular
            .module('Titan', ['ngResource', 'ngMaterial', 'ngSanitize', 'ngMessages'])
            .config(function($mdThemingProvider, $mdIconProvider){
              $mdThemingProvider.theme('default')
                    .primaryPalette('blue-grey')
                    .accentPalette('red');
            });;

require('./services/group');
require('./services/job');

require('./controllers/ParentCtrl');
require('./controllers/ParentDialogCtrl');

require('./controllers/NewGroupDialogController');
require('./controllers/NewJobDialogController');
require('./controllers/EditGroupDialogController');

require('./controllers/IndexController');


console.log("client initialized");
