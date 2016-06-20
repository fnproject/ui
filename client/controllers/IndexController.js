angular.module('Titan').controller('IndexController', ['$scope', '$controller', 'Group', function($scope, $controller, Group) {
  $controller('ParentCtrl', {$scope: $scope})

  $scope.init = function() {
    $scope.groupService = new Group($scope.serverErrorHandler)

    $scope.groupService.all({}, function(groups){
      $scope.groups = groups;
    });

  }
  $scope.init();

}]);