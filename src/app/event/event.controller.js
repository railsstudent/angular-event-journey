'use strict';

angular.module('angularEventJourney')
  .controller('EventCtrl', ['$scope', '$stateParams',  
  	function ($scope, $stateParams) {
  		$scope.data = {
  			organization : $stateParams.organization,
  			desc : $stateParams.desc
  		};
}]);