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
    $scope.loadGroupJobs();
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

  $scope.cancelJob = function(job) {
    var jobService = new Job($scope.selectedGroup, $scope.serverErrorHandler)

    if (confirm("Do you really want to cancel job #" + job.id + " ?")){
      jobService.cancel(job, function(updatedjob){
        console.log("jobService.cancel!!", updatedjob);
        // TODO: update properly
        job.status = updatedjob.status;
      });
    }
  }

  $scope.retryJob = function(job) {
    var jobService = new Job($scope.selectedGroup, $scope.serverErrorHandler)

    if (confirm("Do you really want to retry job #" + job.id + " ?")){
      jobService.retry(job, function(updatedjob){
        console.log("jobService.retry!!", updatedjob);
        // TODO: update properly
        job.status = updatedjob.status;
      });
    }
  }




  $scope.init();

}]);