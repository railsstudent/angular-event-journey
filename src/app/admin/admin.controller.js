'use strict';

angular.module('angularEventJourney')
  .controller('AdminCtrl', ['$rootScope', '$scope', '$state',
     function ($rootScope, $scope, $state) {

      var onAuthError = function _onAuthError(error) {
        $scope.errorObj.title = error.code;
        $scope.errorObj.message = error.message;
      };

      var onAuthSuccess = function _onAuthSuccess(authData) {
        $rootScope.authData = authData;
        $rootScope.displayName = $rootScope.getName(authData);
        $state.transitionTo('home');
      };

      $scope.promise = null;

    	$scope.submitForm = function _submitForm(isValid) {

    		// return userid
        $scope.errorObj.message = '';
        $scope.errorObj.title = '';
        if (isValid) {
          $scope.promise = $rootScope.login($scope.user);
          $scope.promise.then(onAuthSuccess, onAuthError);
        }
    	};

      $scope.thirdPartyLogin = function _thirdPartyLogin(provider) {
        $scope.errorObj.message = '';
        $scope.errorObj.title = '';
        $scope.promise = $rootScope.thirdPartyLogin(provider);
        $scope.promise.then(onAuthSuccess, onAuthError);
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
