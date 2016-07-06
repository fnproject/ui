var express = require('express');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');

var per_page = 30;


var processJobAction = function(req, res, action){
  var path = "/v1/groups/" + encodeURIComponent(req.params.group) + "/jobs/" + encodeURIComponent(req.params.id) + "/" + action;

  successcb = function(data){
    console.log(action + " success!", data);
    res.json(data.job);
  }
  errorcb = function(status, err){
    console.log("error!", err);
    res.status(400).json({msg: "Error: Api responded with " + status + ". " + err});
  }

  helpers.postApiEndpoint(req, path, {}, successcb, errorcb);
}

router.get('/:group/jobs', function(req, res) {
  var path = "/v1/groups/" + encodeURIComponent(req.params.group) + "/jobs";

  successcb = function(data){
    //console.log("success!", data);
    var jobs = data.jobs;
    res.json(jobs);
  }
  errorcb = function(status, err){
    console.log("error!", status, err);
    res.status(400).json({msg: "Error: Api responded with " + status + ". " + err});
  }

  helpers.getApiEndpoint(req, path, {n: per_page}, successcb, errorcb)
});

router.post('/:group/jobs/:id/cancel', function(req, res) {
  processJobAction(req, res, "cancel");
});

router.post('/:group/jobs/:id/retry', function(req, res) {
  processJobAction(req, res, "retry");
});


module.exports = router;
