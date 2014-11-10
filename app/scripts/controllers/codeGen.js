/**
 * Created by Fathalian on 11/10/14.
 */
angular.module('nestorApp')
.controller('CodeGenCtrl', ['$scope', '$modalInstance',
    function($scope, $modalInstance){

    $scope.ok = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
