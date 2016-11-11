angular.module('Titan').controller('NewGroupDialogController', ['$mdDialog', '$scope', '$controller', '$timeout', 'App', function($mdDialog, $scope, $controller, $timeout, App) {
  $controller('ParentDialogCtrl', {$scope: $scope});

  $scope.init = function() {
    $scope.app = {}
    $scope.appService = new App($scope.serverErrorHandler);
  }

  $scope.createApp = function(){
    $scope.appService.create($scope.app, function(group){
      $scope.app = {};
      $mdDialog.hide();
    });

  };

  $scope.init();
}]);
