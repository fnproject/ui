var express = require('express');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');

router.get('/', function(req, res) {
  successcb = function(data){
    //console.log("success!", data);
    var groups = data.groups;
    res.json(groups);
  }
  errorcb = function(status, err){
    console.log("error!", status, err);
    res.status(400).json({msg: "Error occured. Api responded with " + status});
  }

  helpers.getApiEndpoint(req, "/v1/groups", {}, successcb, errorcb)
});

// Create New Group
router.post('/', function(req, res) {
  successcb = function(data){
    //console.log("success!", data);
    res.json(data);
  }
  errorcb = function(status, err){
    console.log("error!", status, err);
    res.status(400).json({msg: "Error occured. Api responded with " + status});
  }

  helpers.postApiEndpoint(req, "/v1/groups", {}, {group: req.body.group}, successcb, errorcb);
});

// Update Group
router.patch('/:group', function(req, res) {
  successcb = function(data){
    //console.log("success!", data);
    res.json(data);
  }
  errorcb = function(status, err){
    console.log("error!", status, err);
    res.status(400).json({msg: "Error occured. Api responded with " + status});
  }

  helpers.execApiEndpoint('PUT', req,  "/v1/groups/" + encodeURIComponent(req.params.group) , {}, {group: req.body.group}, successcb, errorcb);
});

// Delete Group
router.delete('/:group', function(req, res) {
  successcb = function(data){
    //console.log("success!", data);
    res.json(data);
  }
  errorcb = function(status, err){
    console.log("error!", status, err);
    res.status(400).json({msg: "Error occured. Api responded with " + status});
  }

  helpers.execApiEndpoint('DELETE', req,  "/v1/groups/" + encodeURIComponent(req.params.group) , {}, {}, successcb, errorcb);
});


module.exports = router;
