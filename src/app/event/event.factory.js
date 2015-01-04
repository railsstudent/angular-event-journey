'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.event
 * @description
 * # event
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('eventFactory', function () {
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
