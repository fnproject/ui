var express = require('express');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');

router.get('/:app/routes', function(req, res) {
  successcb = function(data){
    res.json(data.routes);
  }

  helpers.getApiEndpoint(req, "/v1/apps/" + encodeURIComponent(req.params.app) + "/routes", {}, successcb, helpers.standardErrorcb(res))
});

// Create New Route
router.post('/:app/routes', function(req, res) {
  successcb = function(data){
    res.json(data);
  }

  helpers.postApiEndpoint(req, "/v1/apps/" + encodeURIComponent(req.params.app) + "/routes", {}, {route: req.body}, successcb, helpers.standardErrorcb(res));
});

// Update Route
router.patch('/:app/routes/:route', function(req, res) {
  successcb = function(data){
    res.json(data);
  }
  var data = req.body;
  delete data.path;

  helpers.execApiEndpoint('PATCH', req,  "/v1/apps/" + encodeURIComponent(req.params.app)+ "/routes/" + encodeURIComponent(req.params.route), {}, {route: data}, successcb, helpers.standardErrorcb(res));
});

// Delete Route
router.delete('/:app/routes/:route', function(req, res) {
  successcb = function(data){
    res.json(data);
  }

  helpers.execApiEndpoint('DELETE', req,  "/v1/apps/" + encodeURIComponent(req.params.app)+ "/routes/" + encodeURIComponent(req.params.route) , {}, {}, successcb, helpers.standardErrorcb(res));
});

// Run Route
router.post('/:app/routes/:route/run', function(req, res) {
  successcb = function(data){
    res.json({output: data});
  }
  var data = req.body.payload;

  helpers.execApiEndpointRaw('POST', req,  "/r/" + encodeURIComponent(req.params.app)+ "/" + encodeURIComponent(req.params.route), {}, data, successcb, helpers.standardErrorcb(res));
});


module.exports = router;
