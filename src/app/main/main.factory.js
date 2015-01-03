'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.main
 * @description
 * # main
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('mainFactory', [ '$firebase', function ($firebase) {
// Service logic
// ...
    // Create our Firebase reference
    var refOrganization1 = new Firebase('https://blazing-fire-2680.firebaseio.com/organizations');
    var ref1 = new Firebase('https://blazing-fire-2680.firebaseio.com');
    var refSkill1 = new Firebase('https://blazing-fire-2680.firebaseio.com/skills');
    var refRecords1 = new Firebase('https://blazing-fire-2680.firebaseio.com/organizations/records');
    var refCounter1 = new Firebase('https://blazing-fire-2680.firebaseio.com/organizations/counter');


// Public API here
    return {
      
      refOrganization : function _refOrganization() {
      	return refOrganization1;
      }, 

      ref : function _ref() {
      	return ref1;
      },

      refSkill : function _refSkill() {
        return refSkill1;
      },

      refCounter : function _refCounter() {
        return refCounter1;
      },

      refRecords : function _refRecords() {
        return refRecords1;
      },

      retrieveOrganizations : function _retrieveOrganizations() {
        return $firebase(refRecords1).$asArray();
      },

      addOrganization : function _add(newOrganization) {
        return $firebase(refRecords1).$asArray().$add(newOrganization);
      },

      saveOrganization : function _save(keyId, oldOrganization) {
        return $firebase(refRecords1).$set(keyId, oldOrganization);        
      },

      getNextPage : function _getNextPage(startAtId, limit) {
    //     refRecords1.orderByChild("code").limitToFirst(limit); 
        //return $firebase(refRecords1).$asArray();        
      },

      getPrevPage : function _getPrevPage(endAtId, limit) {
  //       refRecords1.orderByChild("code").limitToLast(limit); 
        //return $firebase(refRecords1).$asArray();        
      },

      getFirstPage : function _getFirstPage(startAtId, limit) {
//         refRecords1.orderByChild("code").limitToFirst(limit); 
        //return $firebase(refRecords1).$asArray();        
      },

      getLastPage : function _getLastPage(startAtId, limit) {
      }
    };
  }]);
