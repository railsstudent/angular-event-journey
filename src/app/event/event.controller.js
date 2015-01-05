'use strict';

angular.module('angularEventJourney')
  .controller('EventCtrl', ['$scope', '$stateParams', 'eventFactory', 'mainFactory', 
  		'$modal', '$timeout',
  	function ($scope, $stateParams, eventFactory, mainFactory, $modal, $timeout) {
  		
	  $scope.events = [];
    $scope.isLoading = true;
    $scope.organizationName = undefined;
  	
  	var organizationId = $stateParams.organizationId;
    var isObject = function(s) { return !_.isNull(s) && !_.isUndefined(s); };

  	var isEventDataLoaded = false;
  	var isNameDataLoaded = false;

    var isAllDataLoaded = function _isAllDataLoaded() {
    	return isEventDataLoaded && isNameDataLoaded; 
    };

  	$scope.loadPage = function _loadPage() {
  		eventFactory.retrieveAllEvents(organizationId).$loaded() 
  			.then(function(data) {
  				$scope.events = _.remove(data, isObject);
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

  		mainFactory.retrieveOrganization(organizationId).$loaded() 
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
                    
                    $scope.eventFrom.$setPristine($scope.eventForm.name);
                    $scope.eventFrom.$setPristine($scope.eventForm.venue);
                    $scope.eventFrom.$setPristine($scope.eventForm.event_date);
                    $scope.eventFrom.$setPristine($scope.eventForm.timeFrom);
                    $scope.eventFrom.$setPristine($scope.eventForm.timeTo);
                    
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
                  });
                }
              };

              var handleAddEvent = function _handleAddEvent(organizationId) {

                  var deferred = $q.defer();
                  var newObj = { name : $scope.new_event.name,
                        venue : $scope.new_event.venue,
                        event_date : $scope.new_event.event_date, 
                        timeFrom : $scope.new_event.timeFrom, 
                        timeTo : $scope.new_event.timeTo,
                        $priority : $scope.new_event.event_date
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

              $scope.new_event = {
                name : '',
                venue : '',
                event_date: new Date(),
                timeFrom: undefined,
                timeTo : undefined
              };
          }],
          size: 'lg',
      });
    };
}]);