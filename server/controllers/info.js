var express = require('express');
var url = require('url');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');

router.get('/api-url', function(req, res) {
  var apiUrl = req.app.get('api-url');
  res.json({url: url.format(apiUrl)});
});

module.exports = router;