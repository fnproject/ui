var express = require('express');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');

router.get('/', function(req, res) {
  successcb = function(data){
    //console.log("success!", data);
    var groups = data.groups;
    res.json(groups);
  }

  helpers.getApiEndpoint(req, "/v1/groups", {}, successcb, helpers.standardErrorcb)
});

// Create New Group
router.post('/', function(req, res) {
  successcb = function(data){
    //console.log("success!", data);
    res.json(data);
  }

  helpers.postApiEndpoint(req, "/v1/groups", {}, {group: req.body.group}, successcb, helpers.standardErrorcb);
});

// Update Group
router.patch('/:group', function(req, res) {
  successcb = function(data){
    //console.log("success!", data);
    res.json(data);
  }

  helpers.execApiEndpoint('PUT', req,  "/v1/groups/" + encodeURIComponent(req.params.group) , {}, {group: req.body.group}, successcb, helpers.standardErrorcb);
});

// Delete Group
router.delete('/:group', function(req, res) {
  successcb = function(data){
    //console.log("success!", data);
    res.json(data);
  }

  helpers.execApiEndpoint('DELETE', req,  "/v1/groups/" + encodeURIComponent(req.params.group) , {}, {}, successcb, helpers.standardErrorcb);
});


module.exports = router;
