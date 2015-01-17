'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.technology
 * @description
 * # technology
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('technologyFactory', [ '$firebase', function ($firebase) {
// Service logic
// ...
    // Create our Firebase reference
    var refFrontend1 = new Firebase('https://blazing-fire-2680.firebaseio.com/technology/front-end');    
    var refBackend1 = new Firebase('https://blazing-fire-2680.firebaseio.com/technology/back-end');
    var refTool1 = new Firebase('https://blazing-fire-2680.firebaseio.com/technology/tools');
    var refHosting1 = new Firebase('https://blazing-fire-2680.firebaseio.com/technology/hosting');

// Public API here
    return {
      
      refFrontend : function _refFrontend() {
      	return refFrontend1;
      },

      refBackend : function _refBackend() {
        return refBackend1;
      },

      refTool : function _refTool() {
        return refTool1;
      },

     refHosting : function _refHosting() {
        return refHosting1;
      },

      retrieveFrontend : function _retrieveFrontend() {
        return $firebase(refFrontend1).$asArray();
      },

     retrieveBackend : function _retrieveFrontend() {
        return $firebase(refBackend1).$asArray();
      },

     retrieveTool : function _retrieveFrontend() {
        return $firebase(refTool1).$asArray();
      },

      retrieveHosting : function _retrieveHosting() {
        return $firebase(refHosting1).$asArray();
      }  
    };
  }]);
