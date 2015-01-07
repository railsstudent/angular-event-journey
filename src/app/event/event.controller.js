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

                  var parsedDate = Date.parse($scope.new_event.event_date);
                  var parsedDateTime = Date.parse($scope.new_event.event_date);
                  var dt = new Date(parsedDateTime);
                  var event_date = dt.getFullYear() + '-' 
                    + (dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth()) + '-' + dt.getDate();

                  parsedDateTime = Date.parse($scope.new_event.timeFrom);
                  dt = new Date(parsedDateTime);
                  var minutes = dt.getMinutes();
                  var timeFrom = dt.getHours() + ':' + (minutes < 10 ? '0' + minutes : minutes);

                  parsedDateTime = Date.parse($scope.new_event.timeTo);
                  dt = new Date(parsedDateTime);
                  minutes = dt.getMinutes();
                  var timeTo = dt.getHours() + ':' + (minutes < 10 ? '0' + minutes : minutes);

                  var newObj = { name : $scope.new_event.name,
                        venue : $scope.new_event.venue,
                        event_date : event_date, 
                        timeFrom : timeFrom, 
                        timeTo : timeTo,
                        $priority : parsedDate
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
              $scope.timezoneOffset = today.getTimezoneOffset();
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
    
    /*  $modal.open({
        keyboard : false,
        templateUrl: 'app/event/event.edit.html',
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

              $scope.saveEvent = function _saveEvent(isValid) {
                if (isValid) {
                  $scope.state.isLoading = true;
                  $scope.msgObj = {
                      message : '',
                      cssClassName : ''
                  };

                  handleSaveEvent(organizationId).then(function(ref) {
                    $scope.save_event.name = '';
                    $scope.save_event.venue = '';
                    $scope.save_event.event_date = undefined;
                    $scope.save_event.timeFrom = undefined;
                    $scope.save_event.timeTo = undefined;
                    
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

                  var parsedDate = Date.parse($scope.new_event.event_date);
                  var parsedDateTime = Date.parse($scope.new_event.event_date);
                  var dt = new Date(parsedDateTime);
                  var event_date = dt.getFullYear() + '-' 
                    + (dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth()) + '-' + dt.getDate();

                  parsedDateTime = Date.parse($scope.new_event.timeFrom);
                  dt = new Date(parsedDateTime);
                  var minutes = dt.getMinutes();
                  var timeFrom = dt.getHours() + ':' + (minutes < 10 ? '0' + minutes : minutes);

                  parsedDateTime = Date.parse($scope.new_event.timeTo);
                  dt = new Date(parsedDateTime);
                  minutes = dt.getMinutes();
                  var timeTo = dt.getHours() + ':' + (minutes < 10 ? '0' + minutes : minutes);

                  var newObj = { name : $scope.new_event.name,
                        venue : $scope.new_event.venue,
                        event_date : event_date, 
                        timeFrom : timeFrom, 
                        timeTo : timeTo,
                        $priority : parsedDate
                       };

                  eventFactory.saveEvent(organizationId, eventId, editObj, priorityId)
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
              $scope.timezoneOffset = today.getTimezoneOffset();
              $scope.new_event = {
                name : '',
                venue : '',
                event_date: today,
                timeFrom: today,
                timeTo : today
              };
          }],
          size: 'lg',
      });*/
    };
}]);