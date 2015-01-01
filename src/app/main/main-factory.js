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
    var refSkill = new Firebase('https://blazing-fire-2680.firebaseio.com/skills');

// Public API here
    return {
      
      refOrganization : function _refOrganization() {
      	return refOrganization;
      }, 

      ref : function _ref() {
      	return ref;
      },

      refSkill : function _refSkill() {
        return refSkill;
      }
    };
  }])
  .service('mainService', function() {
      this.editMap = {};

      this.getEditMap = function _getEditMap() {
        return this.editMap;
      };

      this.setEditMap = function _setEditMap(m) {
        this.editMap = m;
      }

      this.setEditObjState = function _setEditObjState(key, val) {
        this.editMap[key] = val;
      }

      this.getEditObjState = function _getEditObjState(key) {
        return this.editMap[key];
      }
  });
