'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.event
 * @description
 * # event
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('eventFactory', [ '$firebaseArray', '$firebaseObject', '$q',
    function ($firebaseArray, $firebaseObject, $q) {
// Service logic
// ...
  // Create our Firebase reference
    var organizationUrl = 'https://blazing-fire-2680.firebaseio.com/organizations/records/';

// Public API here
    return {

      refCounter : function _refCounter(organizationId) {
        var eventUrl = organizationUrl + organizationId + '/event_counter';
        return new Firebase(eventUrl);
      },

      refEvent : function _refEvent(organizationId) {
        var eventUrl = organizationUrl + organizationId + '/events';
        return new Firebase(eventUrl);
      },

      retrieveAllEvents : function _retrieveAllEvents(organizationId) {
		    var eventUrl = organizationUrl + organizationId + '/events';
		    return $firebaseArray(new Firebase(eventUrl));
      },

      retrieveEvent : function _retrieveEvent(input) {
    		var eventUrl = organizationUrl + input.organizationId + '/events/' + input.eventId;
    		return $firebaseObject(new Firebase(eventUrl));
      },

      addEvent : function _addEvent(organizationId, newEvent) {
        var eventUrl = organizationUrl + organizationId + '/events';
          return $firebaseArray(new Firebase(eventUrl)).$add(newEvent);
      },

      saveEvent : function _saveEvent(input, existEvent, priority) {
        var eventUrl = organizationUrl + input.organizationId + '/events/' + input.eventId;
        var deferred = $q.defer();
        var ref = new Firebase(eventUrl);
        ref.setWithPriority(existEvent, priority);
        deferred.resolve(ref);
        return deferred.promise;
      },

      deleteEvent : function _deleteEvent(organizationId, eventId) {
        var eventUrl = organizationUrl + organizationId + '/events/' + eventId;
        return new Firebase(eventUrl).remove();
      },

      convertToMilliseconds : function _convertToMilliseconds(strEventDate,
                                strTimeFrom, strTimeTo) {

        var dt = new Date(strEventDate);
        var dtFrom = new Date(strTimeFrom);
        var dtTo = new Date(strTimeTo);

        var dtDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), 0, 0, 0, 0);
        var dtFromTime = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(),
                      dtFrom.getHours(), dtFrom.getMinutes(), dtFrom.getSeconds(), 0);
        var dtToTime = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(),
                      dtTo.getHours(), dtTo.getMinutes(), dtTo.getSeconds(), 0);
        return {
          'eventDate' :dtDate.getTime(),
          'timeFrom' : dtFromTime.getTime(),
          'timeTo' : dtToTime.getTime()
        };
      },

      isEarlierThan : function _isEarlierThan(milliSeconds1, milliSeconds2) {
        return milliSeconds1 < milliSeconds2;
      },

      isDateInPast : function _isDateInPast(eventDate) {
        var now = new Date();
        return eventDate < now.getTime();
      }

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
