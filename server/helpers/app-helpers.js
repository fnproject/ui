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
  return httpurl;
}

exports.getApiEndpoint = function(req, path, params, successcb, errorcb) {
  var url = exports.apiFullUrl(req, path);

  console.log("GET " + url + ", params: ", params);

  request({url: url, qs: params}, exports.requrestCb);
}

exports.postApiEndpoint = function(req, path, params, postfields, successcb, errorcb) {
  exports.execApiEndpoint('POST', req, path, params, postfields, successcb, errorcb);
}

exports.execApiEndpoint = function(method, req, path, params, postfields, successcb, errorcb) {
  var options = {
    uri: exports.apiFullUrl(req, path),
    method: method,
    json: postfields
  };

  console.log(options.method + " " + options.uri + ", params: ", options.json);

  request(options, exports.requrestCb);
}



exports.requrestCb = function (error, response, body) {
  var parsed;
  if (!error && response.statusCode >= 200 && response.statusCode < 300) {
    try {
      if (typeof body == "string"){
        parsed = JSON.parse(body);
      } else {
        parsed = body;
      }
    } catch (e) {
      console.warn("Can not parse json:", body, e);
    };
    if (parsed){
      successcb(parsed);
    } else {
      errorcb(response.statusCode, "Can not parse api response");
    };
  } else {
    var message;
    try {
      if (typeof body == "string"){
        parsed = JSON.parse(body);
      } else {
        parsed = body;
      }
      if (parsed && parsed.error && parsed.error.message){
        message = parsed.error.message;
      }
    } catch (e) {
      message = "Can not parse api response";
    }
    message = message || "An error ocurred."

    console.warn("[ERR] " + response.statusCode + " | "  + message);
    errorcb(response.statusCode, message);
  }
}



