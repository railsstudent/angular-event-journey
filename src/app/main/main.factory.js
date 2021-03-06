'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.main
 * @description
 * # main
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('mainFactory', function ($firebaseObject, $firebaseArray, $q) {
// Service logic
// ...
    // Create our Firebase reference
//    var refOrganization1 = new Firebase('https://blazing-fire-2680.firebaseio.com/organizations');
    var ref1 = new Firebase('https://blazing-fire-2680.firebaseio.com');
    var refSkill1 = new Firebase('https://blazing-fire-2680.firebaseio.com/skills');

    var organizationUrl = 'https://blazing-fire-2680.firebaseio.com/organizations';
    var refRecords1 = new Firebase('https://blazing-fire-2680.firebaseio.com/organizations/records');
    var refCounter1 = new Firebase('https://blazing-fire-2680.firebaseio.com/organizations/counter');
    var refCategories1 = new Firebase('https://blazing-fire-2680.firebaseio.com/categories');

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

      refCategories : function _refCategories() {
        return refCategories1;
      },

      getChildRef : tmpGetChildRef,

      retrieveOrganization : function _retrieveOrganization(id) {
        return $firebaseObject(refRecords1.child(id));
      },

      addOrganization : function _addOrganization(newOrganization) {
        var deferred = $q.defer();
        var newOrganizationRef = refRecords1.push(newOrganization);
        deferred.resolve(newOrganizationRef);
        return deferred.promise;
      },

      saveOrganization : function _saveOrganization(keyId, oldOrganization) {
          var deferred = $q.defer();
          var childRef = refRecords1.child(keyId);
          childRef.set(oldOrganization);
          deferred.resolve(childRef);
          return deferred.promise;
      },

      removeOrganization : function _removeOrganization(keyId) {
        var obj = $firebaseObject(refRecords1.child(keyId));
        return obj.$remove();
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
      },

      getOrganizationTypes : function _getOrganizationTypes() {
          return [
                  { id: 'COMMUNITY', value: 'Community' },
                  { id: 'MEETUP', value: 'Meetup Group' },
                  { id: 'STARTUP', value: 'Startup' },
                  { id: 'OTHERS', value: 'Others' }
                ];
      }
    };
  });
