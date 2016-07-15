angular.module('Titan').factory('Group', ['$resource', '$http', function($resource, $http) {
  var Group;
  return Group = (function() {
    function Group(errorHandler) {
      var defaults;
      this.service = $resource('/api/groups/:id/:action', {
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

    Group.prototype.create = function(attrs, cb) {
      if (cb == null) {
        cb = null;
      }
      return new this.service({
        group: attrs
      }).$save((function(group) {
        return typeof cb === "function" ? cb(group) : void 0;
      }), this.errorHandler);
    };

    // Group.prototype["delete"] = function(group, cb) {
    //   if (cb == null) {
    //     cb = null;
    //   }
    //   return new this.service().$delete({
    //     id: group.id
    //   }, (function(res) {
    //     return typeof cb === "function" ? cb(res) : void 0;
    //   }), this.errorHandler);
    // };

    // Group.prototype.update = function(group, attrs, cb) {
    //   if (cb == null) {
    //     cb = null;
    //   }
    //   return new this.service({
    //     group: attrs
    //   }).$update({
    //     id: group.id
    //   }, (function(group) {
    //     return typeof cb === "function" ? cb(group) : void 0;
    //   }), this.errorHandler);
    // };

    Group.prototype.all = function(params, cb) {
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

    Group.prototype.jobs = function(id, cb) {
      return this.service.query({
        id: id,
        action: 'jobs'
      }, (function(group) {
        if (typeof cb === "function") {
          cb(group);
        }
        return group;
      }), this.errorHandler);
    };

    return Group;

  })();


}]);

