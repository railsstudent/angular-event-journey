'use strict';
/**
 * @ngdoc function
 * @name angularEventJourney.controller:technologyCtrl
 * @description
 * # technologyCtrl
 * Controller of the angularEventJourney
 */
angular.module('angularEventJourney')
  .controller('technologyCtrl', ['$scope', 'technologyFactory',
   	function ($scope, technologyFactory) {
    
    $scope.frontend = undefined;
    $scope.backend = undefined;
    $scope.tool = undefined;
  	$scope.isLoading = true;
  	
  	var isFrontEndDataLoaded = false;
  	var isBackEndDataLoaded = false;
  	var isToolDataLoaded = false;  	

    var isAllDataLoaded = function _isAllDataLoaded() {
    	return isFrontEndDataLoaded && isBackEndDataLoaded 
    		&& isToolDataLoaded;
    };

    var isObject = function(s) { return !_.isNull(s) && !_.isUndefined(s); };


  	$scope.loadPage = function _loadPage() {
  		technologyFactory.retrieveFrontend().$loaded() 
  			.then(function(data) {
  				$scope.frontend = _.remove(data, isObject);
  				isFrontEndDataLoaded = true;
  				if (isAllDataLoaded()) {
  					$scope.isLoading = false;
  				}
  			}, function (error) {
  				isFrontEndDataLoaded = true;
  				if (isAllDataLoaded()) {
  					$scope.isLoading = false;
  				}
  			});

  		technologyFactory.retrieveBackend().$loaded() 
  			.then(function(data) {
  				$scope.backend = _.remove(data, isObject);
  				isBackEndDataLoaded = true;
  				if (isAllDataLoaded()) {
  					$scope.isLoading = false;
  				}
  			}, function (error) {
  				isBackEndDataLoaded = true;
  				if (isAllDataLoaded()) {
  					$scope.isLoading = false;
  				}
  			});
  			
  		technologyFactory.retrieveTool().$loaded() 
  			.then(function(data) {
  				$scope.tool = _.remove(data, isObject);
  				isToolDataLoaded = true;
  				if (isAllDataLoaded()) {
  					$scope.isLoading = false;
  				}
  			}, function (error) {
  				isToolDataLoaded = true;
  				if (isAllDataLoaded()) {
  					$scope.isLoading = false;
  				}
  			});		
  	};

  }]);
