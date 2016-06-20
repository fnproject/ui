 var http = require('http');
 var url = require('url');

exports.extend = function(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}


 // exports.respondJson = function(res, data) {
 //  res.setHeader('Content-Type', 'application/json');
 //  res.end(JSON.stringify(data));
 // }

exports.getApiEndpoint = function(req, path, successcb, errorcb) {
  var apiUrl = req.app.get('api-url');
  var httpurl = exports.extend({}, apiUrl, {path: path});

  http.get(httpurl, function(response) {
    if (response.statusCode != 200) {
      console.warn("Request returned " + response.statusCode);
      return errorcb(response);
    }

    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var parsed
      try {
        parsed = JSON.parse(body);
        successcb(parsed);
      } catch (e) {
        console.warn("Can not parse json:", e);
        errorcb(e);
      }
    });
  }).on('error', function(err) {
    console.error('Error with the request:', err, err.message);
    errorcb(err);
  });
}



