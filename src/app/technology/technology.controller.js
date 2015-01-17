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

    $scope.techModel = {    
      frontend : undefined,
      backend : undefined,
      tool : undefined,
      hosting : undefined,
  	  isLoading : true
    };
  	
  	var isFrontEndDataLoaded = false;
  	var isBackEndDataLoaded = false;
  	var isToolDataLoaded = false;  	
    var isHostingDataLoaded = false;

    var isAllDataLoaded = function _isAllDataLoaded() {
    	return isFrontEndDataLoaded && isBackEndDataLoaded && isToolDataLoaded
        && isHostingDataLoaded;
    };

    var isObject = function(s) { return !_.isNull(s) && !_.isUndefined(s); };

  	$scope.loadPage = function _loadPage() {
  		technologyFactory.retrieveFrontend().$loaded() 
  			.then(function(data) {
  				$scope.techModel.frontend = _.remove(data, isObject);
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
  				$scope.techModel.backend = _.remove(data, isObject);
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
  				$scope.techModel.tool = _.remove(data, isObject);
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

      technologyFactory.retrieveHosting().$loaded() 
        .then(function(data) {
          $scope.techModel.hosting = _.remove(data, isObject);
          isHostingDataLoaded = true;
          if (isAllDataLoaded()) {
            $scope.isLoading = false;
          }
        }, function (error) {
          isHostingDataLoaded = true;
          if (isAllDataLoaded()) {
            $scope.isLoading = false;
          }
        });
  	};

  }]);
