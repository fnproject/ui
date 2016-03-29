angular.module('Titan').controller('IndexController', ['$scope', function($scope) {
  $scope.init = function() {

    $scope.images = [
      {id: 1, name: "foo"},
      {id: 2, name: "bar"}
    ];
    console.log("IndexController.js - init");
  }

  $scope.init();
}]);