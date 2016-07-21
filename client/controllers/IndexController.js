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
    $scope.groupService = new Group($scope.serverErrorHandler)

    $scope.loadGroups();
  }

  $scope.loadGroups = function() {
    $scope.groupService.all({}, function(groups){
      $scope.groups = angular.fromJson(angular.toJson(groups));;
    });
  }

  /**
   * Hide or Show the 'left' sideNav area
   */
  $scope.toggleSidebar = () => $mdSidenav('left').toggle();
  $scope.toggleJobDetails = () =>  $mdSidenav('right').toggle();




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
