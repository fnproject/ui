angular.module('Titan').controller('IndexController', [
    '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$scope', '$controller', '$timeout', '$route', '$routeParams', '$location', 'Group', 'Job',
    function($mdSidenav, $mdBottomSheet, $mdDialog, $scope, $controller, $timeout, $route, $routeParams, $location, Group, Job) {
  $controller('ParentCtrl', {$scope: $scope})

  $scope.perPage = 10;

  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

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
  $scope.toggleSidebar = () => $mdSidenav('left').toggle();
  $scope.toggleJobDetails = () =>  $mdSidenav('right').toggle();

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


  $scope.selectGroup = function(group){
    $scope.resetGroupValues();
    $scope.selectedGroup = group;
    $mdSidenav('right').close();

    $scope.loadGroupJobs();
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
        job: {image: $scope.selectedGroup.image, priority: 0}
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
        group: angular.copy($scope.selectedGroup)
      }
    }).then(function(group) {
      // ok
      var pos =  $scope.groups.indexOf($scope.selectedGroup)
      $scope.selectedGroup = group;
      if (pos != -1) {
        $scope.groups[pos] = group;
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

  $scope.deleteGroup = function() {
    if ($scope.selectedGroup && confirm("Do you really want to delete group '" + $scope.selectedGroup.name + "' ?")){
      $scope.groupService.delete($scope.selectedGroup, function(res){
        $scope.loadGroups();
      });
    }
  }



  $scope.init();

}]);
