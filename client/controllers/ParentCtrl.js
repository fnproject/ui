angular.module('Titan').controller('ParentCtrl', ['$scope', function($scope) {

  $scope.possiblePriorities = [0, 1, 2];

  $scope.serverErrorHandler = function(error) {
    var message = null;
    try {
      message = error.data.msg;
    } catch (undefined) {}
    message = message || "There was a server error, please reload the page and try again.";

    console.log("error:", message);
    // TODO: nice flash message
  };

  $scope.formattedPayload = function(job) {
    if (!job) {
      return
    };
    var payload = job.payload;
    try {
      payload = JSON.stringify(JSON.parse(payload), null, 4);
    } catch (undefined) {}

    return payload;
  }

}]);
