console.log("loading .... ");

require('expose?$!expose?jQuery!jquery');
// require('bootstrap-loader/extractStyles');

require('expose?angular!angular');
require('expose?angular-resource!angular-resource');

require('expose?angular-aria!angular-aria');
require('expose?angular-animate!angular-animate');
//require('expose?angular-material!angular-material');

require("./css/app.css");

var titan = angular
            .module('Titan', ['ngResource', 'ngMaterial'])
            .config(function($mdThemingProvider, $mdIconProvider){
              $mdThemingProvider.theme('default')
                    .primaryPalette('blue-grey')
                    .accentPalette('red');
            });;

require('./services/group');
require('./services/job');

require('./controllers/ParentCtrl');
require('./controllers/IndexController');


console.log("client initialized");
