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
    var refOrganization = new Firebase('https://blazing-fire-2680.firebaseio.com/organizations');
    var ref = new Firebase('https://blazing-fire-2680.firebaseio.com');

// Public API here
    return {
      
      refOrganization : function _refOrganization() {
      	return refOrganization;
      }, 

      ref : function _ref() {
      	return ref;
      }
    };
  }]);
