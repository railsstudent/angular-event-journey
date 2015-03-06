'use strict';
/**
 * @ngdoc function
 * @name angularEventJourney.controller:technologyCtrl
 * @description
 * # technologyCtrl
 * Controller of the angularEventJourney
 */
angular.module('angularEventJourney')
  .controller('technologyCtrl', ['$scope', '$q', 'technologyFactory',
   	function ($scope, $q, technologyFactory) {

    $scope.techModel = {    
      frontend : undefined,
      backend : undefined,
      tool : undefined,
      hosting : undefined     
    };
  	
    var isObject = function(s) { return !_.isNull(s) && !_.isUndefined(s); };

    $scope.promises = $q.all(
       [technologyFactory.retrieveFrontend().$loaded()
      ,technologyFactory.retrieveBackend().$loaded()
      ,technologyFactory.retrieveTool().$loaded()
      ,technologyFactory.retrieveHosting().$loaded()]);

    $scope.loadPage = function _loadPage() {
         $scope.promises.then(function(dataArray) {
            $scope.techModel.frontend = _.remove(dataArray[0], isObject);
            $scope.techModel.backend = _.remove(dataArray[1], isObject);
            $scope.techModel.tool = _.remove(dataArray[2], isObject);
            $scope.techModel.hosting = _.remove(dataArray[3], isObject);
         });
  	};

  }]);
