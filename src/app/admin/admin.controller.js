'use strict';

angular.module('angularEventJourney')
  .controller('AdminCtrl', ['$rootScope', '$scope', '$location', '$state', 'adminFactory',
     function ($rootScope, $scope, $location, $state, adminFactory) {

     	// use firebase username/password authentication
     	$scope.scrollToElement = function _scrollToElement(elementId) {
      		$location.hash(elementId);
      		$anchorScroll();
    	};

    	$scope.submitForm = function _submitForm(isValid) {
    		// return userid
        $scope.errorObj.message = '';
        $scope.errorObj.title = '';
        if (isValid) {
          adminFactory.authWithPassword($scope.user).then(
            function onAuthSuccess(authData) {
              $rootScope.authData = authData;
              $state.transitionTo('home')
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
