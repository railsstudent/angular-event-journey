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

  	$scope.showEventForm = function _showEventForm() {
        
      $modal.open({
        keyboard : false,
        templateUrl: 'app/main/event.add.html',
        controller: ['$scope', '$modalInstance', '$q', 'eventFactory',
              function _modalController ($scope, $modalInstance, $q, eventFactory) { 

              $scope.isLoading = false;
        
              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

              $scope.addEvent = function _addEvent(isValid) {
                if (isValid) {
                  $scope.isLoading = true;
                  $scope.msgObj = {
                      message : '',
                      cssClassName : ''
                  };

                  handleAddEvent().then(function(id) {
                    $scope.event.name = '';
                    $scope.event.venue = '';
                    $scope.event.date = undefined;
                    $scope.event.timeFrom = undefined;
                    $scope.event.timeTo = undefined;
                    
                    $scope.eventFrom.$setPristine($scope.eventFrom.name);
                    $scope.eventFrom.$setPristine($scope.eventFrom.venue);
                    $scope.eventFrom.$setPristine($scope.eventFrom.date);
                    $scope.eventFrom.$setPristine($scope.eventFrom.timeFrom);
                    $scope.eventFrom.$setPristine($scope.eventFrom.timeTo);
                    
                    // update counter
                    refCounter.transaction(function(currentValue) {
                      return (currentValue || 0) + 1;
                    });

                    $scope.isLoading = false;
                    $scope.msgObj.message = 'ADD_ORG_SUCCESS_CODE'; // 'Congratuation!!! Add organization is successful.';
                    $scope.msgObj.cssClassName = 'success';

                    $timeout(function() {
                      $modalInstance.close();
                    }, 1500);
                  }, function(error) {
                    $scope.isLoading = false;
                    $scope.msgObj.message = 'ADD_ORG_ERROR_CODE'; // 'Fail to add new organization.';
                    $scope.msgObj.cssClassName = 'danger';
                  });
                }
              };

              var handleAddEvent = function _handleAddEvent() {

                  var deferred = $q.defer();
                  var newObj = { code : $scope.organization.shortname,
                        description : $scope.organization.description,
                        url : $scope.organization.website, 
                        facebook : $scope.organization.facebook, 
                        meetup : $scope.organization.meetup,
                        name : $scope.organization.name
                      };

                  mainFactory.addOrganization(newObj)
                      .then(function (ref) {
                          if (ref) {
                            deferred.resolve(ref.key());
                          } else {
                            deferred.reject('');
                          }
                      });
                  return deferred.promise;
              };

              $scope.event = {
                name : '',
                venue : '',
                date: undefined,
                timeFrom: undefined,
                timeTo : undefined
              };
          }],
          size: 'lg',
      });
    };
}]);