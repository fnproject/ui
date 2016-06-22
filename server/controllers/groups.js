var express = require('express');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');

router.get('/', function(req, res) {
  successcb = function(data){
    console.log("success!", data);
    var groups = data.groups;
    res.json(groups);
  }
  errorcb = function(status, err){
    console.log("error!", status, err);
    res.status(400).json({msg: "Error occured. Api responded with " + status});
  }

  helpers.getApiEndpoint(req, "/v1/groups", successcb, errorcb)
});


module.exports = router;
