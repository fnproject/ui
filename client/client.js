console.log("loading .... ");

require('expose?$!expose?jQuery!jquery');
require('bootstrap-loader/extractStyles');

require('expose?angular!angular');
require('expose?angular-resource!angular-resource');

require("./css/app.css");

var titan = angular.module('Titan', ['ngResource']);

require('./services/group');
require('./services/job');

require('./controllers/ParentCtrl');
require('./controllers/IndexController');


console.log("client initialized");
