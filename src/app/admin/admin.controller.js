'use strict';

angular.module('angularEventJourney')
  .controller('AdminCtrl', ['$rootScope', '$scope', '$state',
     function ($rootScope, $scope, $state) {

//      $scope.isLoading = false;
      $scope.promise = null;

    	$scope.submitForm = function _submitForm(isValid) {

    		// return userid
        $scope.errorObj.message = '';
        $scope.errorObj.title = '';
        if (isValid) {
//          $scope.isLoading = true;

//          $rootScope.login($scope.user).then(
          $scope.promise = $rootScope.login($scope.user);
          $scope.promise.then(
            function onAuthSuccess(authData) {
//              $scope.isLoading = false;
              $rootScope.authData = authData;
              $state.transitionTo('home');
            },
            function onAuthError(error) {
//              $scope.isLoading = false;
              $scope.errorObj.title = error.code;
              $scope.errorObj.message = error.message;
            });
        }
    	};

      $scope.user = {
        email : '',
        password : ''
      };

      $scope.errorObj = { 
        title: '', 
        message: '' 
      };

  }]);
