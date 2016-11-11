angular.module('Titan').factory('App', ['$resource', '$http', function($resource, $http) {
  var App;
  return App = (function() {
    function App(errorHandler) {
      var defaults;
      this.service = $resource('/api/apps/:id/:action', {
        id: '@id'
      }, {
        update: {
          method: 'PATCH'
        }
      });
      this.errorHandler = errorHandler;
      defaults = $http.defaults.headers;
      defaults.patch = defaults.patch || {};
      defaults.patch['Content-Type'] = 'application/json';
    }

    App.prototype.create = function(attrs, cb) {
      if (cb == null) {
        cb = null;
      }
      return new this.service({
        group: attrs
      }).$save((function(group) {
        return typeof cb === "function" ? cb(group) : void 0;
      }), this.errorHandler);
    };

    App.prototype["delete"] = function(group, cb) {
      if (cb == null) {
        cb = null;
      }
      return new this.service().$delete({
        id: group.name
      }, (function(res) {
        return typeof cb === "function" ? cb(res) : void 0;
      }), this.errorHandler);
    };

    App.prototype.update = function(group, attrs, cb) {
      if (cb == null) {
        cb = null;
      }
      return new this.service({
        group: attrs
      }).$update({
        id: group.name
      }, (function(group) {
        return typeof cb === "function" ? cb(group) : void 0;
      }), this.errorHandler);
    };

    App.prototype.all = function(params, cb) {
      var k, v;
      if (cb == null) {
        cb = null;
      }
      return this.service.query(params, (function(groups) {
        if (cb) {
          return cb(groups);
        }
      }), this.errorHandler);
    };

    return App;

  })();


}]);

