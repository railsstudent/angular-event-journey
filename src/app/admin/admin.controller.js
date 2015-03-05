'use strict';

angular.module('angularEventJourney')
  .controller('AdminCtrl', ['$rootScope', '$scope', '$state',
     function ($rootScope, $scope, $state) {

      $scope.promise = null;

    	$scope.submitForm = function _submitForm(isValid) {

    		// return userid
        $scope.errorObj.message = '';
        $scope.errorObj.title = '';
        if (isValid) {
          $scope.promise = $rootScope.login($scope.user);
          $scope.promise.then(
            function onAuthSuccess(authData) {
              $rootScope.authData = authData;
              $state.transitionTo('home');
            },
            function onAuthError(error) {
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
