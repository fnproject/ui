// var express = require('express');
// var router = express.Router();
// var helpers = require('../helpers/app-helpers.js');
// var request = require('request');

// var per_page = 30;


// var processJobAction = function(req, res, action){
//   var path = "/v1/groups/" + encodeURIComponent(req.params.group) + "/jobs/" + encodeURIComponent(req.params.id) + "/" + action;

//   successcb = function(data){
//     //console.log(action + " success!", data);
//     res.json(data.job);
//   }

//   helpers.postApiEndpoint(req, path, {}, {}, successcb, helpers.standardErrorcb);
// }

// router.get('/:group/jobs', function(req, res) {
//   var path = "/v1/groups/" + encodeURIComponent(req.params.group) + "/jobs";

//   successcb = function(data){
//     res.json(data);
//   }

//   helpers.getApiEndpoint(req, path, {n: req.query.per_page || per_page, cursor: req.query.cursor || null}, successcb, helpers.standardErrorcb);
// });

// router.get('/:group/jobs/:id', function(req, res) {
//   var msg;
//   var path = "/v1/groups/" + encodeURIComponent(req.params.group) + "/jobs/" + encodeURIComponent(req.params.id);

//   successcb = function(data){
//     res.json(data.job);
//   }

//   helpers.getApiEndpoint(req, path, {}, successcb, helpers.standardErrorcb);
// });

// router.post('/:group/jobs/:id/cancel', function(req, res) {
//   processJobAction(req, res, "cancel");
// });

// router.post('/:group/jobs/:id/retry', function(req, res) {
//   processJobAction(req, res, "retry");
// });

// // Post New Job
// router.post('/:group/jobs', function(req, res) {
//   var path = "/v1/groups/" + encodeURIComponent(req.params.group) + "/jobs";
//   var attrs = {jobs: [req.body.job]};

//   successcb = function(data){
//     //console.log(action + " success!", data);
//     res.json(data.jobs[0]);
//   }

//   helpers.postApiEndpoint(req, path, {}, attrs, successcb, helpers.standardErrorcb);
// });

// router.get('/:group/jobs/:id/log', function(req, res) {
//   var path = "/v1/groups/" + encodeURIComponent(req.params.group) + "/jobs/" + encodeURIComponent(req.params.id) + "/log";
//   var requrestCb = function(error, response, body){
//     if (!error && response.statusCode == 200) {
//       res.json({log: body});
//     } else {
//       res.status(400).json({msg: "Error: Api responded with " + response.statusCode + ". " + body});
//     }
//   }

//   var url = helpers.apiFullUrl(req, path);

//   request({url: url, qs: {}}, requrestCb);
// });


// module.exports = router;
