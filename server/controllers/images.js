var express = require('express');
var router = express.Router();
var helpers = require('../helpers/app-helpers.js');

router.get('/', function(req, res) {

  // 1. GET /images
  //
  /* response format:
  {
    "images": [
      {
        "name": "string",
        "created_at": "2016-03-29T16:28:40.356Z"
      }
    ]
  }
  */
  var images = [
    {
      "name": "string",
      "created_at": "2016-03-29T16:28:40.356Z"
    },
    {
      "name": "yet another name",
      "created_at": "2016-03-29T16:28:40.356Z"
    }
  ];

  res.json(images);
});




module.exports = router;
