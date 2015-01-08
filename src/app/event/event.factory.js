'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.event
 * @description
 * # event
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('eventFactory', [ '$firebase', '$q', function ($firebase, $q) {
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
          return $firebase(new Firebase(eventUrl)).$asArray().$add(newEvent);
      },

      saveEvent : function _saveEvent(organizationId, eventId, existEvent, priority) {
        var eventUrl = organizationUrl + organizationId + '/events/' + eventId;
////        var sync = $firebase(new Firebase(eventUrl));

        var deferred = $q.defer();
        var ref = new Firebase(eventUrl);
        ref.setWithPriority(existEvent, priority);
        deferred.resolve(ref);

//        sync.$set(existEvent)
//          .then(function(ref) {
//            var sync1 = $firebase(ref);
//            var obj = sync.$asObject();
//            obj.$priority = priority;
//            return  deferred(obj.$save()); 
//          }, function (error) {
//            console.log("Error:", error); 
//            return deferred.reject(sync);            
//          });
      //  return $firebase(new Firebase(eventUrl)).$set(existEvent);
          return deferred.promise;
      },

      deleteEvent : function _deleteEvent(organizationId, eventId) {
        var eventUrl = organizationUrl + organizationId + '/events/' + eventId;
        return $firebase(new Firebase(eventUrl)).$remove();
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
          'event_date' :dtDate.getTime(),
          'event_time_from' : dtFromTime.getTime(),
          'event_time_to' : dtToTime.getTime()     
        };
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
