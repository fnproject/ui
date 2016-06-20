var express = require('express');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');


router.get('/:group/jobs', function(req, res) {
  var path = "/v1/groups/" + encodeURIComponent(req.params.group) + "/jobs";

  successcb = function(data){
    console.log("success!", data);
    var jobs = data.jobs;
    res.json(jobs);
  }
  errorcb = function(err){
    console.log("error!", err);
    res.status(400).json({msg: "Error occured"});
  }

  helpers.getApiEndpoint(req, path, successcb, errorcb)
});



module.exports = router;
