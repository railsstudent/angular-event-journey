'use strict';

angular.module('angularEventJourney')
  .controller('AdminCtrl', ['$rootScope', '$scope', '$location', '$state',
     function ($rootScope, $scope, $location, $state) {

     	// use firebase username/password authentication
     	$scope.scrollToElement = function _scrollToElement(elementId) {
      		$location.hash(elementId);
      		$anchorScroll();
    	};

      $scope.isLoading = false;

    	$scope.submitForm = function _submitForm(isValid) {

    		// return userid
        $scope.errorObj.message = '';
        $scope.errorObj.title = '';
        if (isValid) {
          $scope.isLoading = true;

          $rootScope.login($scope.user).then(
            function onAuthSuccess(authData) {
              $scope.isLoading = false;
              $rootScope.authData = authData;
              $state.transitionTo('home')
            },
            function onAuthError(error) {
              $scope.isLoading = false;
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
