console.log("Hello World!")

var express = require('express');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');

router.get('/', function(req, res) {
  successcb = function(data){
    console.log("GetApps: ", data.items)
    res.json(data.items);
  }

  helpers.getApiEndpoint(req, "/v2/apps", {}, successcb, helpers.standardErrorcb(res))
});

router.get('/:app', function(req, res) {
  successcb = function(data){
    res.json(data.app);
  }

  helpers.getApiEndpoint(req, "/v2/apps/" + encodeURIComponent(req.params.app), {}, successcb, helpers.standardErrorcb(res))
});

// Create New App
router.post('/', function(req, res) {
  successcb = function(data){
    res.json(data);
  }
  var data = req.body;

  helpers.postApiEndpoint(req, "/v2/apps", {}, {app: data}, successcb, helpers.standardErrorcb(res));
});

// Update App
router.patch('/:app', function(req, res) {
  successcb = function(data){
    res.json(data);
  }

  var data = req.body;
  delete data.name;

  helpers.execApiEndpoint('PUT', req,  "/v2/apps/" + encodeURIComponent(req.params.app) , {}, {app: data}, successcb, helpers.standardErrorcb(res));
});

// Delete App
router.delete('/:app', function(req, res) {
  successcb = function(data){
    res.json(data);
  }

  helpers.execApiEndpoint('DELETE', req,  "/v2/apps/" + encodeURIComponent(req.params.app) , {}, {}, successcb, helpers.standardErrorcb(res));
});


module.exports = router;
