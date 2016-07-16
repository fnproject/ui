angular.module('Titan').controller('ParentDialogCtrl', ['$scope', '$controller', '$mdDialog', function($scope, $controller, $mdDialog) {
  $controller('ParentCtrl', {$scope: $scope});

  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };


}]);
