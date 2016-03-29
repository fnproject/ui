var express = require('express');
var path = require('path');
var helpers = require('./server/helpers/app-helpers.js');

var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 4000;
var publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));

app.use(require('./server/router.js'));

app.listen(port, function () {
  console.log('Server running on port ' + port);
});