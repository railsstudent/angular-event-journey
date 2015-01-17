'use strict';

angular.module('angularEventJourney')
  .controller('EventCtrl', ['$scope', '$stateParams', 'eventFactory', 
      'mainFactory', '$modal', '$timeout', 'RATE',
  	function ($scope, $stateParams, eventFactory, mainFactory, $modal, $timeout, RATE) {
  		
	  $scope.events = [];
    $scope.isLoading = true;
    $scope.organizationName = undefined;
    $scope.numEvents = 0;

    var refCounter = eventFactory.refCounter($stateParams.organizationId);
    refCounter.on('value', function(dataSnapShot) {
      $scope.numEvents = (dataSnapShot.val() || 0);
    });
  	
  	$scope.organizationId = $stateParams.organizationId;

  	var isEventDataLoaded = false;
  	var isNameDataLoaded = false;

    var isAllDataLoaded = function _isAllDataLoaded() {
    	return isEventDataLoaded && isNameDataLoaded; 
    };

  	$scope.loadPage = function _loadPage() {
  		eventFactory.retrieveAllEvents($scope.organizationId).$loaded() 
  			.then(function(data) {
          $scope.events = data;
				  isEventDataLoaded = true; 
  				if (isAllDataLoaded()) {
  					$scope.isLoading = false;
  				}
  			}, function (error) {
  				isEventDataLoaded = true; 
  				if (isAllDataLoaded()) {
  					$scope.isLoading = false;
  				}
  			});

  		mainFactory.retrieveOrganization($scope.organizationId).$loaded() 
  			.then(function(data) {
  				$scope.organizationName = data.name;
          isNameDataLoaded = true; 
  				if (isAllDataLoaded()) {
  					$scope.isLoading = false;
  				}
  			}, function (error) {
  				isNameDataLoaded = true; 
  				if (isAllDataLoaded()) {
  					$scope.isLoading = false;
  				}
  			});
  	};

  	$scope.showEventForm = function _showEventForm(organizationId) {
        
      $modal.open({
        keyboard : false,
        templateUrl: 'app/event/event.add.html',
        controller: ['$scope', '$modalInstance', '$q', 'eventFactory',
              function _modalController ($scope, $modalInstance, $q, eventFactory) { 

              $scope.state = {
                  isLoading : false,
                  minStep : 5,
                  isMerdian : false
                };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

              $scope.addEvent = function _addEvent(isValid) {
                if (isValid) {
                  $scope.state.isLoading = true;
                  $scope.msgObj = {
                      message : '',
                      cssClassName : '',
                      additionalMessage : ''                    
                  };

                  handleAddEvent(organizationId).then(function(id) {
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

                    $scope.state.isLoading = false;
                    $scope.msgObj.message = 'ADD_EVENT_SUCCESS_CODE'; // 'Congratuation!!! Add event is successful.';
                    $scope.msgObj.cssClassName = 'success';

                    $timeout(function() {
                      $modalInstance.close();
                    }, 1500);
                  }, function(error) {
                    $scope.state.isLoading = false;
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
                venue : '',
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
      // TODO: show confirmation dialog
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

              $scope.state = {
                  isLoading : false,
                  minStep : 5,
                  isMerdian : false
                };
                
                $scope.hoveringOver = function _hoveringOver(value) {
                  $scope.overStar = value;
                  $scope.percent = RATE.hundred * (value / RATE.base);
                };
  
              $scope.state.isLoading = true;
              var existingEvent = eventFactory.retrieveEvent(organizationId, eventId);
              existingEvent.$loaded().then(
                  function(data) {
                    $scope.editEvent = data;
                    var dt = new Date(data.eventDate);
                    var dateFilter = $filter('date');
                    var strEventDate = dateFilter(dt, 'yyyy-MM-dd');
                    $scope.editEvent.eventDate = strEventDate;
                    $scope.state.isLoading = false;
                  }, function(error) {
                    $scope.editEvent = undefined;
                    $scope.state.isLoading = false;
                  }
                );

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

              $scope.saveEvent = function _saveEvent(isValid) {
                if (isValid) {
                  $scope.state.isLoading = true;
                  $scope.msgObj = {
                      message : '',
                      cssClassName : '',
                      additionalMessage : ''
                  };

                handleSaveEvent(organizationId, eventId).then(function(ref) {
                    $scope.editEvent = undefined;

                    $scope.eventForm.$setPristine($scope.eventForm.name);
                    $scope.eventForm.$setPristine($scope.eventForm.venue);
                    $scope.eventForm.$setPristine($scope.eventForm.eventDate);
                    $scope.eventForm.$setPristine($scope.eventForm.timeFrom);
                    $scope.eventForm.$setPristine($scope.eventForm.timeTo);
                    $scope.eventForm.$setPristine($scope.eventForm.rate);
                    
                    $scope.state.isLoading = false;
                    $scope.msgObj.message = 'EDIT_EVENT_SUCCESS_CODE'; // 'Congratuation!!! Add event is successful.';
                    $scope.msgObj.cssClassName = 'success';

                    $timeout(function() {
                      $modalInstance.close();
                    }, 1500);
                  }, function(error) {
                    $scope.state.isLoading = false;
                    $scope.msgObj.message = 'EDIT_EVENT_ERROR_CODE'; // 'Fail to add new event.';
                    $scope.msgObj.cssClassName = 'danger';
                    
                    if (error && !_.isEmpty(error)) {
                      $scope.msgObj.additionalMessage = error;
                    }
                  });
                }
              };

              var handleSaveEvent = function _handleSaveEvent(organizationId, eventId) {

                  var deferred = $q.defer();

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
                  return deferred.promise;
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