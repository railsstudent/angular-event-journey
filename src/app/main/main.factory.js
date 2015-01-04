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
//    var refOrganization1 = new Firebase('https://blazing-fire-2680.firebaseio.com/organizations');
    var ref1 = new Firebase('https://blazing-fire-2680.firebaseio.com');
    var refSkill1 = new Firebase('https://blazing-fire-2680.firebaseio.com/skills');

    var organizationUrl = 'https://blazing-fire-2680.firebaseio.com/organizations';
    var refRecords1 = new Firebase('https://blazing-fire-2680.firebaseio.com/organizations/records');    
    var refCounter1 = new Firebase('https://blazing-fire-2680.firebaseio.com/organizations/counter');

    var tmpGetChildRef = function _getChildRef(relativePath) {
        if (relativePath) {
          if (relativePath.substring(0, 1) !== '/') {
            relativePath = '/' + relativePath;
          }
          return new Firebase(organizationUrl + relativePath);   
        }
        return null;
      };

// Public API here
    return {
      
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

      getChildRef : tmpGetChildRef,

      retrieveOrganization : function _retrieveOrganization(id) {
        return $firebase(tmpGetChildRef('/records/' + id)).$asObject();
      },

      addOrganization : function _add(newOrganization) {
//        return $firebase(refRecords1).$asArray().$add(newOrganization);
        return $firebase(refRecords1).$push(newOrganization);
      },

      saveOrganization : function _save(keyId, oldOrganization) {
          return $firebase(refRecords1).$set(keyId, oldOrganization);        
      },

      getNextPage : function _getNextPage(startAtId, limit) {
        // http://jsfiddle.net/katowulf/yumaB/
        var priority = startAtId ? null : undefined;
        return refRecords1.startAt(priority, startAtId)
                .limitToFirst(limit);  
      },

      getPrevPage : function _getPrevPage(endAtId, limit) {
          return refRecords1.endAt(null, endAtId)
                .limitToLast(limit);       
      }
    };
  }]);
