var express = require('express');
var path = require('path');
var url = require('url');
var bodyParser = require('body-parser');

var helpers = require('./server/helpers/app-helpers.js');

var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var apiUrl = url.parse(process.env.FN_API_URL);
if (!apiUrl || !apiUrl.hostname) {
  console.log("API URL not set. Please specify Functions API URL via environment variable, e.g. FN_API_URL=http://localhost:8080 npm start");
  process.exit(1);
}

app.set('api-url', apiUrl);
var port = process.env.PORT || 4000;
var publicPath = path.resolve(__dirname, 'public');

app.use(express.static(publicPath));
app.use(bodyParser.json());

app.use(require('./server/router.js'));

app.disable('etag');

app.listen(port, function () {
  console.log('Using API url: ' + apiUrl.host);
  console.log('Server running on port ' + port);
});
