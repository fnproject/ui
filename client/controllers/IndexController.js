angular.module('Titan').controller('IndexController', ['$scope', '$controller', '$timeout', 'Group', 'Job', function($scope, $controller, $timeout, Group, Job) {
  $controller('ParentCtrl', {$scope: $scope})

  $scope.selectedJob = {id: 'foo'};

  $scope.init = function() {
    $scope.groupService = new Group($scope.serverErrorHandler)

    $scope.groupService.all({}, function(groups){
      $scope.groups = groups;
    });

  }

  $scope.selectGroup = function(group){
    $scope.selectedGroup = group;
    $scope.loadGroupJobs(group);
  }

  $scope.loadGroupJobs = function(){
    $scope.groupJobs = null;
    var jobService = new Job($scope.selectedGroup, $scope.serverErrorHandler)
    jobService.all({}, function(jobs){
      $scope.groupJobs = jobs;
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