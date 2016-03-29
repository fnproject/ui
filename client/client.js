console.log("loading .... ");

require('expose?$!expose?jQuery!jquery');
require('bootstrap-loader/extractStyles');

require('expose?angular!angular');

require("./css/app.css.scss");

require("./css/app.css.scss");

window.titan = angular.module('Titan', []);

require('./controllers/IndexController');


console.log("client initialized");