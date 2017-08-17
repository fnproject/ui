var express = require('express');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');

router.get('/', function(req, res) {
  successcb = function(data){
    res.json(data);
  }

  helpers.getApiEndpoint(req, "/stats", {}, successcb, helpers.standardErrorcb(res))
});

module.exports = router;
