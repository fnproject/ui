angular.module('Titan').controller('GroupJobsController', ['$mdDialog', '$mdSidenav', '$scope', '$controller',  '$location', '$routeParams' , 'Job', function($mdDialog, $mdSidenav, $scope, $controller, $location, $routeParams, Job) {

  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.currentPage = 0;
  $scope.cursors = [];

  $scope.init = function(){
    console.log("GroupJobsController - loaded!", $scope.$routeParams);

    $scope.$parent.selectedGroup = _.find($scope.groups, (gr) => gr.name == $scope.$routeParams.group_name);

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
      var pos =  $scope.groups.indexOf($scope.$parent.selectedGroup)
      $scope.$parent.selectedGroup = group;
      if (pos != -1) {
        $scope.groups[pos] = group;
      }
    }, function() {
      // cancel
    });
  }

  $scope.showLog = function(ev, job) {
    $scope.selectedJob = job;
    var parentEl = angular.element(document.body);
    var jobService = new Job($scope.$parent.selectedGroup, $scope.serverErrorHandler);

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
    var jobService = new Job($scope.$parent.selectedGroup, $scope.$parent.serverErrorHandler);
    jobService.all({per_page: $scope.perPage, cursor: cursor}, function(data){
      $scope.groupJobs = data.jobs || [];
      $scope.cursors[page + 1] = data.cursor;
      $scope.isLoading = false;
    })
  }



  $scope.init();
}]);
