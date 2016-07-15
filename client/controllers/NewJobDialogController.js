angular.module('Titan').controller('NewJobDialogController', ['$mdDialog', '$scope', '$controller', 'Job', 'group', 'job', function($mdDialog, $scope, $controller, Job, group, job) {
  $controller('ParentDialogCtrl', {$scope: $scope});

  $scope.group = group;
  $scope.job = job;

  $scope.init = function() {
    $scope.jobService = new Job($scope.group, $scope.serverErrorHandler);
  };

  $scope.createJob = function(){
    $scope.jobService.create($scope.job, function(job){
      $mdDialog.hide(job);
    });
  };

  $scope.init();
}]);
