'use strict';

angular.module('angularEventJourney')
  .controller('EventCtrl', ['$scope', '$stateParams', 'eventFactory', 
      'mainFactory', '$modal', 'RATE', 
  	function ($scope, $stateParams, eventFactory, mainFactory, $modal, RATE) {
  		
	  $scope.events = [];
    $scope.organizationName = undefined;
    $scope.numEvents = 0;
    // array of hashmap of [ { id : eventId, tags: [hash tags] } ]
    $scope.hashtags = [];

    var refCounter = eventFactory.refCounter($stateParams.organizationId);
    refCounter.on('value', function(dataSnapShot) {
      $scope.numEvents = (dataSnapShot.val() || 0);
    });

    var computeHashtagSummary = function _hashtagSummary() {
      var aggregatedHashtags = {};
      _.forEach($scope.hashtags, function(o) {
        var allTags = o.tags;
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
        $scope.hashtags.push ({ id : newEventId,  
                                tags : tagArray });
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
    $scope.promises = [];

  	$scope.loadPage = function _loadPage() {
  		var promise0 = eventFactory.retrieveAllEvents($scope.organizationId).$loaded();
      $scope.promises.push (promise0);
  		promise0.then(function(data) {
          $scope.events = data;
  			});

      var promise1 = mainFactory.retrieveOrganization($scope.organizationId).$loaded();
      $scope.promises.push (promise1);
  		promise1.then(function(data) {
  				$scope.organizationName = data.name;
  			});
  	};

  	$scope.showEventForm = function _showEventForm(organizationId) {
        
      $modal.open({
        keyboard : false,
        templateUrl: 'app/event/event.add.html',
        controller: ['$scope', '$modalInstance', '$q', 'eventFactory',
              function _modalController ($scope, $modalInstance, $q, eventFactory) { 

              $scope.promise = null;
              $scope.minDuration = 3000;
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
                    $scope.newEvent.venue = '';
                    $scope.newEvent.eventDate = undefined;
                    $scope.newEvent.timeFrom = undefined;
                    $scope.newEvent.timeTo = undefined;

                    $scope.eventForm.$setPristine($scope.eventForm.name);
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
                  } else {

                    var newObj = { name : $scope.newEvent.name,
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

              $scope.openDatepicker = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
              };

              var today = new Date();
              $scope.newEvent = {
                name : '',
                venue : 'TBD',
                eventDate: today,
                timeFrom: today,
                timeTo : today,
                hashtag : 'TBD'
              };
          }],
          size: 'lg',
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
        controller: ['$scope', '$modalInstance', '$q', 'eventFactory', '$filter',
            function _modalController ($scope, $modalInstance, $q, eventFactory, $filter) { 

              $scope.promise = null;
              $scope.minDuration = 3000;

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
                   } else {

                      var rate = $scope.editEvent.rate || 0;
                      var percent = RATE.hundred * (($scope.editEvent.rate || 0) / RATE.base);
                      var editObj = { name : $scope.editEvent.name,
                            venue : $scope.editEvent.venue,
                            eventDate : oEvent.eventDate, 
                            timeFrom : oEvent.timeFrom, 
                            timeTo : oEvent.timeTo,
                            hashtag : $scope.editEvent.hashtag,
                            rate : rate,
                            percent: percent
                           };
                      var priority = oEvent.timeTo;
                      eventFactory.saveEvent(organizationId, eventId, editObj, priority)
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
  
              $scope.promise = eventFactory.retrieveEvent(organizationId, eventId).$loaded();
              $scope.promise.then(function(data) {
                    $scope.editEvent = data;
                    var dt = new Date(data.eventDate);
                    var dateFilter = $filter('date');
                    var strEventDate = dateFilter(dt, 'yyyy-MM-dd');
                    $scope.editEvent.eventDate = strEventDate;
                  }, function(error) {
                    $scope.editEvent = undefined;
                  }
                );

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

              $scope.saveEvent = function _saveEvent(isValid) {
                
                if (isValid) {
                  $scope.msgObj = {
                      message : '',
                      cssClassName : '',
                      additionalMessage : ''
                  };

                  $scope.promise = handleSaveEvent(organizationId, eventId);
                  $scope.promise.then(function(ref) {
                      $scope.editEvent = undefined;

                      $scope.eventForm.$setPristine($scope.eventForm.name);
                      $scope.eventForm.$setPristine($scope.eventForm.venue);
                      $scope.eventForm.$setPristine($scope.eventForm.eventDate);
                      $scope.eventForm.$setPristine($scope.eventForm.timeFrom);
                      $scope.eventForm.$setPristine($scope.eventForm.timeTo);
                      $scope.eventForm.$setPristine($scope.eventForm.rate);
                      
                      $scope.msgObj.message = 'EDIT_EVENT_SUCCESS_CODE'; // 'Congratuation!!! Add event is successful.';
                      $scope.msgObj.cssClassName = 'success';
                      $modalInstance.close();
                    }, function(error) {
                      $scope.msgObj.message = 'EDIT_EVENT_ERROR_CODE'; // 'Fail to add new event.';
                      $scope.msgObj.cssClassName = 'danger';
                      
                      if (error && !_.isEmpty(error)) {
                        $scope.msgObj.additionalMessage = error;
                      }
                    });
                }
              };

              $scope.openDatepicker = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.opened = true;
              };
          }],
          size: 'lg',
      });
    };
}]);