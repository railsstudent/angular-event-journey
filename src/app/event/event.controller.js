'use strict';

angular.module('angularEventJourney')
  .controller('EventCtrl', eventController)
  .controller('EventAddModalCtrl', eventAddModalController)
  .controller('EventEditModalCtrl', eventEditModalController);

function eventController($scope, $stateParams, eventFactory, mainFactory, $modal, $q, timeFactory, geocoderFactory) {

    $scope.events = [];
    $scope.organizationName = undefined;
    $scope.numEvents = 0;
    // array of hashmap of [ { id : eventId, tags: [hash tags] } ]
    $scope.hashtags = [];
    $scope.searchText = '';
    $scope.isCollapsed = false;

    var refCounter = eventFactory.refCounter($stateParams.organizationId);
    refCounter.on('value', function(dataSnapShot) {
      $scope.numEvents = (dataSnapShot.val() || 0);
    });

    var computeHashtagSummary = function _hashtagSummary() {
      var aggregatedHashtags = {};
      _.forEach($scope.hashtags, function(o) {
        _.forEach(o.tags, function (t) {
          if (aggregatedHashtags[t]) {
            aggregatedHashtags[t] = aggregatedHashtags[t] + 1;
          } else {
            aggregatedHashtags[t] = 1;
          }
        });
      });
      return aggregatedHashtags;
    };

    var refEvent = eventFactory.refEvent($stateParams.organizationId);
    refEvent.on('child_added', function(dataSnapShot) {
        var addedTags = dataSnapShot.val().hashtag;
        var newEventId = dataSnapShot.key();
        var tagArray = _.map(addedTags.split(','), function(t) {
                              return _.trim(t).toLowerCase();
                        });
        $scope.hashtags.push ({ id : newEventId, tags : tagArray });
        $scope.hashtagSummary = computeHashtagSummary();
    });

    refEvent.on('child_removed', function(dataSnapShot) {
        var removedEventId = dataSnapShot.key();

        _.remove($scope.hashtags, function(o) {
          return _.isEqual(o.id, removedEventId);
        });
        $scope.hashtagSummary = computeHashtagSummary();
    });

    refEvent.on('child_changed', function(dataSnapShot) {
        var changedTags = dataSnapShot.val().hashtag;
        var changedEventId = dataSnapShot.key();

        var tagArray = _.map(changedTags.split(','), function(t) {
                              return _.trim(t).toLowerCase();
                        });

        var matched = _.find($scope.hashtags, function (o) {
                          return _.isEqual(o.id, changedEventId);
                        });
        if (matched) {
          matched.tags = tagArray;
        }
        $scope.hashtagSummary = computeHashtagSummary();
    });

  $scope.organizationId = $stateParams.organizationId;
  var $eventSyncArray = eventFactory.retrieveAllEvents($scope.organizationId);
  $eventSyncArray.$watch(function (event) {
    var key = event.key;
    var oEvent = _.find($scope.events, function (o) {
                        return _.isEqual(o.$id, key);
                      });
    if (oEvent) {
      oEvent.duration = timeFactory.totalTimeStr(oEvent.timeFrom, oEvent.timeTo);
      oEvent.geocode = geocoderFactory.initGeocode();
      geocoderFactory.getLatLng(oEvent.venue).then(
        function(data) {
           oEvent.geocode.markers[1].lat = data.lat;
           oEvent.geocode.markers[1].lng = data.lng;
           oEvent.geocode.center.lat = data.lat;
           oEvent.geocode.center.lng = data.lng;
        }, function(data) {
           oEvent.geocode.markers[1].lat = data.lat;
           oEvent.geocode.markers[1].lng = data.lng;
           oEvent.geocode.center.lat = data.lat;
           oEvent.geocode.center.lng = data.lng;
        });
    }
  });

  $scope.promises = $q.all([
    $eventSyncArray.$loaded(),
    mainFactory.retrieveOrganization($scope.organizationId).$loaded()
  ]);

  $scope.loadPage = function _loadPage() {
    $scope.promises.then(function(data) {
       $scope.events = data[0];
       _.forEach($scope.events, function (o) {
          o.duration = timeFactory.totalTimeStr(o.timeFrom, o.timeTo);
          o.geocode = geocoderFactory.initGeocode();
          geocoderFactory.getLatLng(o.venue).then(
            function(data) {
               o.geocode.markers[1].lat = data.lat;
               o.geocode.markers[1].lng = data.lng;
               o.geocode.center.lat = data.lat;
               o.geocode.center.lng = data.lng;
            }, function(data) {
               o.geocode.markers[1].lat = data.lat;
               o.geocode.markers[1].lng = data.lng;
               o.geocode.center.lat = data.lat;
               o.geocode.center.lng = data.lng;
            });
        });
       $scope.organizationName = data[1].name;
       $scope.organizationUrl = data[1].url
    });
  };

  $scope.showEventForm = function _showEventForm(organizationId) {
    $modal.open({
      keyboard : false,
      templateUrl: 'app/event/event.add.html',
      controller: 'EventAddModalCtrl',
        size: 'lg',
        resolve : {
          organizationId  : function _resolveOrganizationId () {
                              return organizationId;
                            },
          refCounter : function _resolveRefCounter() {
                          return refCounter;
                        }
        }
    });
  };

  $scope.deleteEvent = function _deleteEvent(organizationId, eventId) {
    var modalInstance = $modal.open({
      templateUrl: 'app/event/event.delete.html',
      controller: function($scope, $modalInstance) {

        $scope.ok = function _ok() {
           $modalInstance.close('confirmed');
        };

        $scope.cancel = function _cancel() {
          $modalInstance.dismiss('cancel');
        };
      },
      size: 'sm'
    });

    modalInstance.result.then(function (value) {
      if (_.isEqual(value, 'confirmed')) {
        // update counter
        refCounter.transaction(function(currentValue) {
            return (currentValue || 0) - 1;
        });
        eventFactory.deleteEvent(organizationId, eventId);
      }
    });
  };

  $scope.showEditEventForm = function _showEditEventForm (organizationId, eventId) {

    $modal.open({
      keyboard : false,
      templateUrl: 'app/event/event.edit.html',
      controller: 'EventEditModalCtrl',
        size: 'lg',
        resolve : {
          input  : function _resolveOrganizationId () {
                      return {
                        organizationId: organizationId,
                        eventId : eventId
                      };
                    }
        }
    });
  };

  $scope.defaults = {
    zoomControl : true
  };
};

function eventAddModalController($scope, $modalInstance, $q, eventFactory, organizationId, refCounter) {

      $scope.promise = null;
      $scope.minDuration = 2000;
      $scope.state = {
          minStep : 5,
          isMerdian : false
      };

      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };

      $scope.addEvent = function _addEvent(isValid) {
        if (isValid) {
          $scope.msgObj = {
              message : '',
              cssClassName : '',
              additionalMessage : ''
          };

          $scope.promise = handleAddEvent(organizationId);
          $scope.promise.then(function(id) {
              $scope.newEvent.name = '';
              $scope.newEvent.building = '';
              $scope.newEvent.venue = '';
              $scope.newEvent.eventDate = undefined;
              $scope.newEvent.timeFrom = undefined;
              $scope.newEvent.timeTo = undefined;

              $scope.eventForm.$setPristine($scope.eventForm.name);
              $scope.eventForm.$setPristine($scope.eventForm.building);
              $scope.eventForm.$setPristine($scope.eventForm.venue);
              $scope.eventForm.$setPristine($scope.eventForm.eventDate);
              $scope.eventForm.$setPristine($scope.eventForm.timeFrom);
              $scope.eventForm.$setPristine($scope.eventForm.timeTo);

              // update counter
              refCounter.transaction(function(currentValue) {
                 return (currentValue || 0) + 1;
              });

              $scope.msgObj.message = 'ADD_EVENT_SUCCESS_CODE'; // 'Congratuation!!! Add event is successful.';
              $scope.msgObj.cssClassName = 'success';

              $modalInstance.close();
            }, function(error) {
              $scope.msgObj.message = 'ADD_EVENT_ERROR_CODE'; // 'Fail to add new event.';
              $scope.msgObj.cssClassName = 'danger';
              if (error && !_.isEmpty(error)) {
                $scope.msgObj.additionalMessage = error;
              }
            });
        }
      };

      var handleAddEvent = function _handleAddEvent(organizationId) {

          var deferred = $q.defer();
          var oEvent = eventFactory.convertToMilliseconds(
              $scope.newEvent.eventDate,
              $scope.newEvent.timeFrom,
              $scope.newEvent.timeTo);

          if (eventFactory.isEarlierThan(oEvent.timeTo, oEvent.timeFrom)) {
            deferred.reject('Event Time To cannot be earlier than Event Time From.');
          /*} else if (eventFactory.isDateInPast(oEvent.timeFrom)) {
            deferred.reject('Event date is in the past.');
          */} else {

            var newObj = { name : $scope.newEvent.name,
                  building : $scope.newEvent.building,
                  venue : $scope.newEvent.venue,
                  eventDate : oEvent.eventDate,
                  timeFrom : oEvent.timeFrom,
                  timeTo : oEvent.timeTo,
                  hashtag : $scope.newEvent.hashtag,
                  rate : 0,
                  percent : 0,
                  $priority : oEvent.timeTo
                 };

            eventFactory.addEvent(organizationId, newObj)
                .then(function (ref) {
                    if (ref) {
                      deferred.resolve(ref.key());
                    } else {
                      deferred.reject('');
                    }
                });
          }
          return deferred.promise;
      };

      $scope.openDatepicker = function _openDatepicker($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };

      var today = new Date();
      $scope.newEvent = {
        name : '',
        building : 'TBD',
        venue : 'TBD',
        eventDate: today,
        timeFrom: today,
        timeTo : today,
        hashtag : 'TBD'
      };
};

function eventEditModalController($scope, $modalInstance, $q, eventFactory, $filter, input, RATE, $timeout) {

      // store original event data. Restore to it if user clicks cancel button
      var origEventData = {};

      console.log('origEventData.name = ' + origEventData.name);

      $scope.promise = null;
      $scope.minDuration = 1500;

      $scope.state = {
          minStep : 5,
          isMerdian : false
      };

      $scope.hoveringOver = function _hoveringOver(value) {
          $scope.overStar = value;
          $scope.percent = RATE.hundred * (value / RATE.base);
      };

        var handleSaveEvent = function _handleSaveEvent(organizationId, eventId) {

            var deferred = $q.defer();
            if ($scope.editEvent) {
              var oEvent = eventFactory.convertToMilliseconds(
                  $scope.editEvent.eventDate,
                  $scope.editEvent.timeFrom,
                  $scope.editEvent.timeTo);

              if (eventFactory.isEarlierThan(oEvent.timeTo, oEvent.timeFrom)) {
                deferred.reject('Event Time To cannot be earlier than Event Time From.');
              /*} else if (eventFactory.isDateInPast(oEvent.timeFrom)) {
                deferred.reject('Event date is in the past.');
              */}  else {

                var rate = $scope.editEvent.rate || 0;
                var percent = RATE.hundred * (($scope.editEvent.rate || 0) / RATE.base);
                var editObj = { name : $scope.editEvent.name,
                      building : $scope.editEvent.building,
                      venue : $scope.editEvent.venue,
                      eventDate : oEvent.eventDate,
                      timeFrom : oEvent.timeFrom,
                      timeTo : oEvent.timeTo,
                      hashtag : $scope.editEvent.hashtag,
                      rate : rate,
                      percent: percent
                     };
                var priority = oEvent.timeTo;
                eventFactory.saveEvent(input, editObj, priority)
                    .then(function (ref) {
                        if (ref) {
                          deferred.resolve(ref.key());
                        } else {
                          deferred.reject('');
                        }
                    });
              }
            }
            return deferred.promise;
        };

        $scope.promise = eventFactory.retrieveEvent(input).$loaded();
        $scope.promise.then(function(data) {
              $scope.editEvent = data;
              var dt = new Date(data.eventDate);
              var dateFilter = $filter('date');
              var strEventDate = dateFilter(dt, 'yyyy-MM-dd');

              origEventData = {
                name: data.name,
                building: data.building,
                venue: data.venue,
                timeFrom: data.timeFrom,
                timeTo: data.timeTo,
                hashtag: data.hashtag,
                eventDate: strEventDate,
                rate: data.rate
              };

            }, function(error) {
              $scope.editEvent = undefined;
            }
          );

        $scope.cancel = function () {
          $scope.editEvent = origEventData;
          $modalInstance.dismiss('cancel');
        };

        $scope.saveEvent = function _saveEvent(isValid) {

          if (isValid) {
            $scope.msgObj = {
                message : '',
                cssClassName : '',
                additionalMessage : ''
            };

            $scope.promise = handleSaveEvent(input.organizationId, input.eventId);
            $scope.promise.then(function(ref) {
                $scope.editEvent = undefined;

                $scope.eventForm.$setPristine($scope.eventForm.name);
                $scope.eventForm.$setPristine($scope.eventForm.building);
                $scope.eventForm.$setPristine($scope.eventForm.venue);
                $scope.eventForm.$setPristine($scope.eventForm.eventDate);
                $scope.eventForm.$setPristine($scope.eventForm.timeFrom);
                $scope.eventForm.$setPristine($scope.eventForm.timeTo);
                $scope.eventForm.$setPristine($scope.eventForm.rate);

                $scope.msgObj.message = 'EDIT_EVENT_SUCCESS_CODE'; // 'Congratuation!!! Add event is successful.';
                $scope.msgObj.cssClassName = 'success';
                $timeout(function() {
                  $modalInstance.close();
                }, 1000);
              }, function(error) {
                $scope.msgObj.message = 'EDIT_EVENT_ERROR_CODE'; // 'Fail to add new event.';
                $scope.msgObj.cssClassName = 'danger';

                if (error && !_.isEmpty(error)) {
                  $scope.msgObj.additionalMessage = error;
                }
              });
          }
        };

        $scope.openDatepicker = function _openDatepicker($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.opened = true;
        };
}
