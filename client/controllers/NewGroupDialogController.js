angular.module('Titan').controller('NewGroupDialogController', ['$mdDialog', '$scope', '$controller', '$timeout', 'Group', function($mdDialog, $scope, $controller, $timeout, Group) {
  $controller('ParentDialogCtrl', {$scope: $scope});

  $scope.init = function() {
    $scope.group = {}
    $scope.groupService = new Group($scope.serverErrorHandler);
  }

  $scope.createGroup = function(){
    $scope.groupService.create($scope.group, function(group){
      $scope.group = {};
      $mdDialog.hide();
    });

  };

  $scope.init();
}]);
