angular.module('Titan').controller('IndexController', [
    '$mdSidenav', '$mdBottomSheet', '$mdDialog', '$scope', '$controller', '$timeout', '$route', '$routeParams', '$location', 'App', 'Job',
    function($mdSidenav, $mdBottomSheet, $mdDialog, $scope, $controller, $timeout, $route, $routeParams, $location, App, Job) {
  $controller('ParentCtrl', {$scope: $scope})

  $scope.perPage = 20;

  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;

  var self = this;
  self.toggleList  = $scope.toggleSidebar;

  $scope.init = function() {
    $scope.appService = new App($scope.serverErrorHandler)

    $scope.loadApps();
  }

  $scope.loadApps = function() {
    $scope.appService.all({}, function(apps){
      $scope.apps = angular.fromJson(angular.toJson(apps));;
    });
  }

  /**
   * Hide or Show the 'left' sideNav area
   */
  $scope.toggleSidebar = () => $mdSidenav('left').toggle();
  $scope.toggleJobDetails = () =>  $mdSidenav('right').toggle();

  $scope.openGroupMenu = ($mdOpenMenu, ev) => {
    // $scope.originatorEv = ev;
    $mdOpenMenu(ev);
  }


  $scope.showNewAppDialog = function(ev) {
    $mdDialog.show({
      controller: 'NewAppDialogController',
      templateUrl: '/templates/new_app.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      fullscreen: false
    }).then(function() {
      // ok
      $scope.loadApps();
    }, function() {
      // cancel
    });
  }

  $scope.deleteApp = function() {
    if ($scope.selectedApp && confirm("Do you really want to delete app '" + $scope.selectedApp.name + "' ?")){
      $scope.appService.delete($scope.selectedApp, function(res){
        $scope.loadApps();
      });
    }
  }



  $scope.init();

}]);
