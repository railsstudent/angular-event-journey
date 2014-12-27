'use strict';

angular.module('angularEventJourney')
  .controller('AdminCtrl', ['$scope', '$location', 'mainFactory', '$firebase',
     function ($scope, $location, mainFactory, $firebase) {

     	// use firebase username/password authentication

     	$scope.scrollToElement = function _scrollToElement(elementId) {
      		$location.hash(elementId);
      		$anchorScroll();
    	};

    	$scope.login = function _login() {
    		// return userid
    	};
  }]);
