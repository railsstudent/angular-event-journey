'use strict';

angular.module('angularEventJourney')
  .controller('EventCtrl', ['$scope', '$stateParams', 'eventFactory', 'mainFactory', 
  		'$modal', '$timeout',
  	function ($scope, $stateParams, eventFactory, mainFactory, $modal, $timeout) {
  		
	  $scope.events = [];
    $scope.isLoading = true;
    $scope.organizationName = undefined;
  	
  	$scope.organizationId = $stateParams.organizationId;
    var isObject = function(s) { return !_.isNull(s) && !_.isUndefined(s); };

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
                  isMerdian : false,
                  format : 'yyyy-MM-dd'
                };

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

              $scope.addEvent = function _addEvent(isValid) {
                if (isValid) {
                  $scope.state.isLoading = true;
                  $scope.msgObj = {
                      message : '',
                      cssClassName : ''
                  };

                  handleAddEvent(organizationId).then(function(id) {
                    $scope.new_event.name = '';
                    $scope.new_event.venue = '';
                    $scope.new_event.event_date = undefined;
                    $scope.new_event.timeFrom = undefined;
                    $scope.new_event.timeTo = undefined;
                    
                    $scope.eventForm.$setPristine($scope.eventForm.name);
                    $scope.eventForm.$setPristine($scope.eventForm.venue);
                    $scope.eventForm.$setPristine($scope.eventForm.event_date);
                    $scope.eventForm.$setPristine($scope.eventForm.timeFrom);
                    $scope.eventForm.$setPristine($scope.eventForm.timeTo);
                    
                    // update counter
                    // refCounter.transaction(function(currentValue) {
                    //   return (currentValue || 0) + 1;
                    // });

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
                  });
                }
              };

              var handleAddEvent = function _handleAddEvent(organizationId) {

                  var deferred = $q.defer();
                  var oEvent = eventFactory.convertToMilliseconds(
                      $scope.new_event.event_date,
                      $scope.new_event.timeFrom, 
                      $scope.new_event.timeTo);

                  var newObj = { name : $scope.new_event.name,
                        venue : $scope.new_event.venue,
                        event_date : oEvent.event_date, 
                        timeFrom : oEvent.event_time_from, 
                        timeTo : oEvent.event_time_to,
                        $priority : oEvent.event_time_to
                       };

                  eventFactory.addEvent(organizationId, newObj)
                      .then(function (ref) {
                          if (ref) {
                            deferred.resolve(ref.key());
                          } else {
                            deferred.reject('');
                          }
                      });
                  return deferred.promise;
              };

              $scope.openDatepicker = function($event) {
                $event.preventDefault();
                $event.stopPropagation();

                $scope.opened = true;
              };

              var today = new Date();
              $scope.new_event = {
                name : '',
                venue : '',
                event_date: today,
                timeFrom: today,
                timeTo : today
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
                  isMerdian : false,
                  format : 'yyyy-MM-dd'
                };

              $scope.state.isLoading = true;
               var existingEvent = eventFactory.retrieveEvent(organizationId, eventId);
                existingEvent.$loaded().then(
                  function(data) {
                    $scope.edit_event = data;
                    $scope.edit_event.event_date = 
                        new Date(data.event_date).toDateString();
                    $scope.state.isLoading = false;
                  }, function(error) {
                    $scope.edit_event = undefined;
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
                      cssClassName : ''
                  };

                handleSaveEvent(organizationId, eventId).then(function(ref) {
                    $scope.edit_event.name = '';
                    $scope.edit_event.venue = '';
                    $scope.edit_event.event_date = undefined;
                    $scope.edit_event.timeFrom = undefined;
                    $scope.edit_event.timeTo = undefined;
                    
                    $scope.eventForm.$setPristine($scope.eventForm.name);
                    $scope.eventForm.$setPristine($scope.eventForm.venue);
                    $scope.eventForm.$setPristine($scope.eventForm.event_date);
                    $scope.eventForm.$setPristine($scope.eventForm.timeFrom);
                    $scope.eventForm.$setPristine($scope.eventForm.timeTo);
                    
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
                  });
                }
              };

              var handleSaveEvent = function _handleSaveEvent(organizationId, eventId) {

                  var deferred = $q.defer();

                  var oEvent = eventFactory.convertToMilliseconds(
                      $scope.edit_event.event_date,
                      $scope.edit_event.timeFrom, 
                      $scope.edit_event.timeTo);

                  var editObj = { name : $scope.edit_event.name,
                        venue : $scope.edit_event.venue,
                        event_date : oEvent.event_date, 
                        timeFrom : oEvent.event_time_from, 
                        timeTo : oEvent.event_time_to
                       };
                  var priority = oEvent.event_time_to;

                  eventFactory.saveEvent(organizationId, eventId, editObj, priority)
                      .then(function (ref) {
                          if (ref) {
                            deferred.resolve(ref.key());
                          } else {
                            deferred.reject('');
                          }
                      });
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