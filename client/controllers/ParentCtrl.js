angular.module('Titan').controller('ParentCtrl', ['$scope', function($scope) {


  $scope.serverErrorHandler = function(error) {
    var message = null;
    try {
      message = error.data.msg;
    } catch (undefined) {}
    message = message || "There was a server error, please reload the page and try again.";

    console.log("error:", message);
    // TODO: nice flash message
  };

}]);
