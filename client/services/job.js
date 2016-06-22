angular.module('Titan').factory('Job', ['$resource', '$http', function($resource, $http) {
  var Job;
  return Job = (function() {
    function Job(group, errorHandler) {
      var defaults;
      this.service = $resource('/api/groups/:group_name/jobs/:id/:action', {
        group_name: group.name,
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

    // Job.prototype.create = function(attrs, cb) {
    //   if (cb == null) {
    //     cb = null;
    //   }
    //   return new this.service({
    //     group: attrs
    //   }).$save((function(group) {
    //     return typeof cb === "function" ? cb(group) : void 0;
    //   }), this.errorHandler);
    // };

    // Job.prototype["delete"] = function(group, cb) {
    //   if (cb == null) {
    //     cb = null;
    //   }
    //   return new this.service().$delete({
    //     id: group.id
    //   }, (function(res) {
    //     return typeof cb === "function" ? cb(res) : void 0;
    //   }), this.errorHandler);
    // };

    // Job.prototype.update = function(group, attrs, cb) {
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

    Job.prototype.cancel = function(job, cb) {
      return new this.service({}).$save({
        id: job.id,
        action: 'cancel'
      }, (function(job) {
        if (typeof cb === "function") {
          cb(job);
        }
      }), this.errorHandler);
    };

    Job.prototype.all = function(params, cb) {
      return this.service.query(params, (function(jobs) {
        if (typeof cb === "function") {
          cb(jobs);
        }
      }), this.errorHandler);
    };

    return Job;
  })();


}]);

