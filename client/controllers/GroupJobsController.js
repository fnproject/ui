angular.module('Titan').controller('GroupJobsController', ['$mdDialog', '$mdSidenav', '$scope', '$controller',  '$location', '$routeParams' , '$interval', '$timeout', 'Job', function($mdDialog, $mdSidenav, $scope, $controller, $location, $routeParams, $interval, $timeout, Job) {

  $scope.taskStatusPollInterval = 5000; // ms. Check for task's status this often
  $scope.unfinishedTaskStatuses = ['running', 'queued', 'delayed'];

  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.currentPage = 0;
  $scope.cursors = [];
  var stop;
  $scope.init = function(){
    console.log("GroupJobsController - loaded!", $scope.$routeParams);

    $scope.$parent.selectedGroup = _.find($scope.$parent.groups, (gr) => gr.name == $scope.$routeParams.group_name);

    console.log("$scope.$parent.selectedGroup", $scope.$parent.groups, $scope.$parent.selectedGroup);

    $scope.jobService = new Job($scope.$parent.selectedGroup, $scope.serverErrorHandler);

    $timeout(function(){$mdSidenav('right').close();}, 100);

    $scope.loadGroupJobs();
    // Check job statuses regularly
    stop = $interval($scope.scheduledCheck, $scope.taskStatusPollInterval);
  }

  $scope.reloadGroupJobs = function (){
    $scope.groupJobs = null;
    $scope.loadGroupJobs();
  }

  $scope.scheduledCheck = function (){
    let jobs = _.filter(($scope.groupJobs || []), (job) => $scope.unfinishedTaskStatuses.indexOf(job.status) > -1 );
    console.log("unfinished jobs: ", jobs);

    var len;
    for (let i = 0, len = jobs.length; i < len; i++) {
      let job = jobs[i];
      console.log(">" + i + " | " + job.id + "delay: " + 200 * i);
      $timeout(function(){ $scope.checkJobStatus(job) }, 200 * i);
    }
  }

  $scope.checkJobStatus = function(job){
    console.log("checkJobStatus " + job.id);
    $scope.jobService.find(job.id, function(res){
      var pos = $scope.groupJobs.indexOf(job);
      if (pos > -1) {
        $scope.groupJobs[pos] = res.toJSON();
      }
    })
  }

  $scope.previousPage = function(){
    if ($scope.currentPage > 0 && !$scope.isLoading) {
      $scope.currentPage = $scope.currentPage - 1;
      $scope.loadGroupJobs();
    }
  }

  $scope.nextPage = function(){
    // TODO: remove +1 after fix
    if (($scope.groupJobs.length + 1) >= $scope.perPage && !$scope.isLoading) {
      $scope.currentPage = $scope.currentPage + 1;
      $scope.loadGroupJobs();
    }
  }

  $scope.showError = function(ev, job) {
    $scope.selectedJob = job;
    var parentEl = angular.element(document.body);
    $mdDialog.show(
      $mdDialog.alert()
        .parent(parentEl)
        .clickOutsideToClose(true)
        .title("Error for job #" + $scope.selectedJob.id)
        .htmlContent("<hr />Reason: <pre>" + $scope.selectedJob.reason + "</pre><br />Error: <pre>" + $scope.selectedJob.error + "</pre>")
        .ok('Close')
        .targetEvent(ev)
    );
  }

  $scope.showNewJobDialog = function(ev) {
    $mdDialog.show({
      controller: 'NewJobDialogController',
      templateUrl: '/templates/new_job.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false,
      locals: {
        group: $scope.$parent.selectedGroup,
        job: {image: $scope.$parent.selectedGroup.image, priority: 0}
      }
    }).then(function(job) {
      // ok
      if ($scope.currentPage == 0) {
        $scope.groupJobs.unshift(job);
      }
    }, function() {
      // cancel
    });
  }

  $scope.showEditGroupDialog = function(ev) {
    $mdDialog.show({
      controller: 'EditGroupDialogController',
      templateUrl: '/templates/edit_group.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false,
      locals: {
        group: angular.copy($scope.$parent.selectedGroup)
      }
    }).then(function(group) {
      // ok
      var pos =  $scope.$parent.groups.indexOf($scope.$parent.selectedGroup)
      $scope.$parent.selectedGroup = group;
      if (pos != -1) {
        $scope.$parent.groups[pos] = group;
      }
    }, function() {
      // cancel
    });
  }

  $scope.showLog = function(ev, job) {
    $scope.selectedJob = job;
    var parentEl = angular.element(document.body);

    $scope.jobService.log($scope.selectedJob.id, function(data){
      console.log(data);
      $mdDialog.show(
        $mdDialog.alert()
          .parent(parentEl)
          .clickOutsideToClose(true)
          .title("Log for job #" + $scope.selectedJob.id)
          .htmlContent("<hr /><pre>" + data.log + "</pre>")
          .ok('Close')
          .targetEvent(ev)
      );
    })
  }


  $scope.showJobDetails = (job = null) => {
    if ($scope.selectedJob == job) {
      $mdSidenav('right').close();
      $scope.selectedJob = null;
    }
    else {
      $scope.selectedJob = job;
      if (!$mdSidenav('right').isOpen()) {
        $mdSidenav('right').toggle();
      }
    }
  }


  $scope.loadGroupJobs = function(){
    $scope.isLoading = true;
    var page = $scope.currentPage;
    var cursor = $scope.cursors[page];
    $scope.jobService.all({per_page: $scope.perPage, cursor: cursor}, function(data){
      $scope.groupJobs = data.jobs || [];
      $scope.cursors[page + 1] = data.cursor;
      $scope.isLoading = false;
    })
  }

  $scope.$on('$destroy', function () {
    // Stop polling for task updates
    if (angular.isDefined(stop)) {
      $interval.cancel(stop);
      stop = undefined;
    }
  });



  $scope.init();
}]);
