angular.module('Titan').controller('NewGroupDialogController', ['$mdSidenav', '$mdBottomSheet', '$mdDialog', '$scope', '$controller', '$timeout', 'Group', 'Job', function($mdSidenav, $mdBottomSheet, $mdDialog, $scope, $controller, $timeout, Group, Job) {
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
