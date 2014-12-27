'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.main
 * @description
 * # main
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('mainFactory', [ function () {
// Service logic
// ...
    // Create our Firebase reference
    var ref = new Firebase('https://blazing-fire-2680.firebaseio.com/organizations');

// Public API here
    return {
      
      refOrganization : function _refOrganization() {
      	return ref;
      }
    };
  }]);
