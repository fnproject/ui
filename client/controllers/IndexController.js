angular.module('Titan').controller('IndexController', ['$scope', '$controller', '$timeout', 'Group', function($scope, $controller, $timeout, Group) {
  $controller('ParentCtrl', {$scope: $scope})

  $scope.selectedJob = {id: 'foo'};

  $scope.init = function() {
    $scope.groupService = new Group($scope.serverErrorHandler)

    $scope.groupService.all({}, function(groups){
      $scope.groups = groups;
      console.log("loaded!", $scope.groups);
    });

  }

  $scope.selectGroup = function(group){
    $scope.selectedGroup = group;
    $scope.loadGroupJobs();
  }

  $scope.loadGroupJobs = function(group){
    $scope.groupJobs = null;
    $scope.groupService.jobs($scope.selectedGroup.name, function(jobs){
      $scope.groupJobs = jobs;
      console.log("loaded!", $scope.groupJobs);
    })
  }


  $scope.showPayload = function(job) {
    $scope.selectedJob = job;
    console.log("$scope.selectedJob  1:",$scope.selectedJob);
    $timeout(function(){$('#jobPayloadModal').modal()}, 50);
  }

  $scope.formattedPayload = function(job) {
    var payload = job.payload;
    try {
      payload = JSON.stringify(JSON.parse(payload), null, 4);
    } catch (undefined) {}

    return payload;
  }




  $scope.init();

}]);