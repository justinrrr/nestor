/**
 * Created by Fathalian on 11/10/14.
 */
'use strict';

angular.module('nestorApp')
  .controller('CodeGenCtrl', ['$scope', '$rootScope','$modalInstance', '$timeout',
    function ($scope, $rootScope, $modalInstance, $timeout) {

      $scope.downloadReady = false;
      $scope.ok = function () {

        if ($scope.downloadReady) {
          $modalInstance.close();
        }
        else {
          $timeout(function(){
            $scope.downloadReady = true;
          }, 1000);
        }
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    }]);
