'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.technology
 * @description
 * # technology
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('technologyFactory', function () {
// Service logic
// ...
    var meaningOfLife = 42;
// Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
