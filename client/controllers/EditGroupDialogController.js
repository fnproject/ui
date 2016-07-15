angular.module('Titan').controller('EditGroupDialogController', ['$mdDialog', '$scope', '$controller', 'Group', 'group', function($mdDialog, $scope, $controller, Group, group) {
  $controller('ParentDialogCtrl', {$scope: $scope});

  $scope.group = group;

  $scope.init = function() {
    $scope.groupService = new Group($scope.serverErrorHandler)

    $scope.envVarsArray = $scope.envVarsToArray($scope.group.env_vars || {});
  };

  $scope.envVarsToArray = function(envVars) {
    var k;
    var arr = [];
    for (k in envVars){
      arr.push({key: k, value: envVars[k]});
    }
    return arr;
  }

  $scope.envVarsFromArray = function(arr) {
    var k, i, v, len;
    var envVars = {};
    for (k = i = 0, len = arr.length; i < len; k = ++i) {
      v = arr[k];
      envVars[v.key] = v.value;
    }
    return envVars;
  }

  $scope.updateGroup = function(){
    $scope.group.env_vars = $scope.envVarsFromArray($scope.envVarsArray);

    $scope.groupService.update($scope.group, $scope.group, function(group){
      $mdDialog.hide(group);
    });
  };

  $scope.addEnvVar = function(){
    $scope.envVarsArray.push({key: "", value: ""});
  };

  $scope.removeEnvVar = function(envVar){
    $scope.envVarsArray.splice($scope.envVarsArray.indexOf(envVar), 1)
  };

  $scope.init();
}]);
