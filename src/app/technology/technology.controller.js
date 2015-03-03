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
      hosting : undefined     
    };
  	
    $scope.promises = [];

    var isObject = function(s) { return !_.isNull(s) && !_.isUndefined(s); };

      var promise0 = technologyFactory.retrieveFrontend().$loaded();
      var promise1 = technologyFactory.retrieveBackend().$loaded();
      var promise2 = technologyFactory.retrieveTool().$loaded();
      var promise3 = technologyFactory.retrieveHosting().$loaded();

      $scope.promises.push(promise0);
      $scope.promises.push(promise1);
      $scope.promises.push(promise2);
      $scope.promises.push(promise3);

    $scope.loadPage = function _loadPage() {
      promise0.then(function(data) {
          $scope.techModel.frontend = _.remove(data, isObject);
        });

  		promise1.then(function(data) {
  				$scope.techModel.backend = _.remove(data, isObject);
  			});
  			
  		promise2.then(function(data) {
  				$scope.techModel.tool = _.remove(data, isObject);
  			});		

      promise3.then(function(data) {
          $scope.techModel.hosting = _.remove(data, isObject);
        });
  	};

  }]);
