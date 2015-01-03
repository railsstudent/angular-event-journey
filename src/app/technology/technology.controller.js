'use strict';
/**
 * @ngdoc function
 * @name angularEventJourney.controller:technologyCtrl
 * @description
 * # technologyCtrl
 * Controller of the angularEventJourney
 */
angular.module('angularEventJourney')
  .controller('technologyCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
