'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.event
 * @description
 * # event
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('eventFactory', [ '$firebase', function ($firebase) {
// Service logic
// ...
  // Create our Firebase reference    
    var organizationUrl = 'https://blazing-fire-2680.firebaseio.com/organizations/records/';

// Public API here
    return {

      retrieveAllEvents : function _retrieveAllEvents(organizationId) {
		var eventUrl = organizationUrl + organizationId + '/events'
		return $firebase(new Firebase(eventUrl)).$asArray();
      },
      
      retrieveEvent : function _retrieveEvent(organizationId, eventId) {
		var eventUrl = organizationUrl + organizationId + '/events/' + eventId;
		return $firebase(new Firebase(eventUrl)).$asObject();
      },

      addEvent : function _addEvent(organizationId, newEvent) {
        var eventUrl = organizationUrl + organizationId + '/events';
        return $firebase(new Firebase(eventUrl)).$push(newEvent);
      },

      saveEvent : function _saveEvent(organizationId, eventId, existEvent) {
        var eventUrl = organizationUrl + organizationId + '/events/' + eventId;
        return $firebase(new Firebase(eventUrl)).$set(existEvent);
      },

      deleteEvent : function _deleteEvent(organizationId, eventId) {
        var eventUrl = organizationUrl + organizationId + '/events/' + eventId;
        return $firebase(new Firebase(eventUrl)).$remove();
      },


/*      getNextPage : function _getNextPage(startAtId, limit) {
        // http://jsfiddle.net/katowulf/yumaB/
        var priority = startAtId ? null : undefined;
        return refRecords1.startAt(priority, startAtId)
                .limitToFirst(limit);  
      },

      getPrevPage : function _getPrevPage(endAtId, limit) {
          return refRecords1.endAt(null, endAtId)
                .limitToLast(limit);       
      }*/
    };
  }]);
