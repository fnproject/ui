var http = require('http');
var url = require('url');
var request = require('request');

exports.extend = function(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

exports.apiFullUrl = function(req, path) {
  var apiUrl = req.app.get('api-url');
  var httpurl = url.format(apiUrl) + path.replace(/^\//, "");
  console.log(">>>>", httpurl);
  return httpurl;
}

exports.getApiEndpoint = function(req, path, successcb, errorcb) {
  var url = exports.apiFullUrl(req, path);

  request(url, exports.requrestCb);
}

exports.postApiEndpoint = function(req, path, postfields, successcb, errorcb) {
  var options = {
    uri: exports.apiFullUrl(req, path),
    method: 'POST',
    json: postfields
  };

  request(options, exports.requrestCb);
}


exports.requrestCb = function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var parsed
    try {
      if (typeof body == "string"){
        parsed = JSON.parse(body);
      } else {
        parsed = body;
      }
      successcb(parsed);
    } catch (e) {
      console.warn("Can not parse json:", body, e);
      errorcb(response.statusCode, e);
    }
  } else {
    console.warn("Request returned " + response.statusCode);
    return errorcb(response.statusCode, body);
  }
}



