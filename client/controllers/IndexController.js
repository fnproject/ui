angular.module('Titan').controller('IndexController', ['$mdSidenav', '$mdBottomSheet', '$mdDialog', '$scope', '$controller', '$timeout', 'Group', 'Job', function($mdSidenav, $mdBottomSheet, $mdDialog, $scope, $controller, $timeout, Group, Job) {
  $controller('ParentCtrl', {$scope: $scope})

  $scope.perPage = 10;

  var self = this;
  self.toggleList  = $scope.toggleSidebar;

  $scope.init = function() {
    $scope.resetGroupValues();

    $scope.groupService = new Group($scope.serverErrorHandler)


    $scope.loadGroups();
  }

  $scope.loadGroups = function() {
    $scope.groupService.all({}, function(groups){
      $scope.groups = groups;
    });
  }

  $scope.resetGroupValues = function() {
    $scope.selectedJob = null;
    // zero-based
    $scope.currentPage = 0;
    // cursor[pageN] is required to load page `pageN`
    $scope.cursors = [];
    $scope.isLoading = false;
  }

  /**
   * Hide or Show the 'left' sideNav area
   */
  $scope.toggleSidebar = function() {
    $mdSidenav('left').toggle();
  }

  $scope.selectGroup = function(group){
    $scope.resetGroupValues();
    $scope.selectedGroup = group;

    $scope.loadGroupJobs();
  }

  $scope.loadGroupJobs = function(){
    $scope.isLoading = true;
    var page = $scope.currentPage;
    var cursor = $scope.cursors[page];
    var jobService = new Job($scope.selectedGroup, $scope.serverErrorHandler);
    jobService.all({per_page: $scope.perPage, cursor: cursor}, function(data){
      $scope.groupJobs = data.jobs || [];
      $scope.cursors[page + 1] = data.cursor;
      $scope.isLoading = false;
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

  $scope.showPayload = function(ev, job) {
    $scope.selectedJob = job;
    var parentEl = angular.element(document.body);
    $mdDialog.show(
      $mdDialog.alert()
        .parent(parentEl)
        .clickOutsideToClose(true)
        .title("Payload for job #" + $scope.selectedJob.id)
        .htmlContent("<hr /><pre>" + $scope.formattedPayload($scope.selectedJob) + "</pre>")
        .ok('Close')
        .targetEvent(ev)
    );
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

  $scope.showLog = function(ev, job) {
    $scope.selectedJob = job;
    var parentEl = angular.element(document.body);
    var jobService = new Job($scope.selectedGroup, $scope.serverErrorHandler);

    jobService.log($scope.selectedJob.id, function(data){
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

  $scope.showNewGroupDialog = function(ev) {
    $mdDialog.show({
      controller: 'NewGroupDialogController',
      templateUrl: '/templates/new_group.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false
    }).then(function() {
      // ok
      $scope.loadGroups();
    }, function() {
      // cancel
    });
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
        group: $scope.selectedGroup,
        job: {image: $scope.selectedGroup.image}
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

  $scope.formattedPayload = function(job) {
    if (!job) {
      return
    };
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
