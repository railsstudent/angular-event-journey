'use strict';

angular.module('angularEventJourney')
  .controller('MainCtrl', ['$scope' , '$location', '$anchorScroll', 
       '$q', '$modal', '$timeout',  'mainFactory', 
     function ($scope, $location, $anchorScroll, $q, $modal, $timeout, mainFactory) {

    // https://www.firebase.com/docs/web/libraries/angular/guide.html
    // https://www.firebase.com/docs/web/libraries/angular/quickstart.html

    // download organizations from firebase
    $scope.organizations = undefined;
    $scope.numOrganization = 0;
    $scope.currentPage = 0;
    $scope.itemPerPage = 0;

    $scope.scrollToElement = function _scrollToElement(elementId) {
      $location.hash(elementId);
      $anchorScroll();
    };

    var refCounter = mainFactory.refCounter();
    refCounter.on('value', function(dataSnapShot) {
      $scope.numOrganization = dataSnapShot.val();
    });

    var prevPage = 0;
    $scope.pageChanged = function _pageChanged() {
      console.log('current page = ' + $scope.currentPage);
      if (prevPage !== $scope.currentPage) { 
        if ($scope.currentPage === 1) {
          console.log ('Load first page....');
          prevPage = $scope.currentPage;
          loadNextPage(undefined);
        } else if (prevPage < $scope.currentPage) {
          console.log('Load next page');
          // get the key of the last organization
          var keys = _.keys($scope.organizations);
          var lastKey = keys[keys.length - 1];
          var startAtId = lastKey ? lastKey: undefined;
          prevPage = $scope.currentPage;
          loadNextPage(startAtId);
        } else if (prevPage > $scope.currentPage) {
          console.log('Load previous page');
          // get the key of the first organization
          var keys = _.keys($scope.organizations);
          var firstKey = keys[0];
          var endAtId = firstKey ? firstKey : undefined;
          prevPage = $scope.currentPage;
          loadPrevPage(endAtId);
        } 
      }
    };

    var loadNextPage = function _loadNextPage(startAtId) {
      if ($scope.state.isLoading === false) {
        $scope.state.isLoading = true;
      }

      var itemPerPage = $scope.itemPerPage;
      itemPerPage = itemPerPage + (startAtId ? 1 : 0);

      mainFactory.getNextPage(startAtId, itemPerPage)
        .once('value', function(dataSnapshot) {
            var vals = dataSnapshot.val()||{};
            if (startAtId) { 
              delete vals[startAtId]; // delete the extraneous record
            }
            // store $id in organization object; otherwise edit organiztion function breaks
            _.forEach(vals, function(v, k) {
              v.$id = k;
            });

            if (!startAtId) {
              $scope.currentPage = 1;
              prevPage = 1;
            }
            $scope.state.isLoading = false; 
            $timeout(function() {
              $scope.organizations = vals;
            }, 100);
        });
    };

    var loadPrevPage = function _loadPrevPage(endAtId) {
      if ($scope.state.isLoading === false) {
        $scope.state.isLoading = true;
      }

      var itemPerPage = $scope.itemPerPage;
      itemPerPage = itemPerPage + (endAtId ? 1 : 0);
      
      mainFactory.getPrevPage(endAtId, itemPerPage)
        .once('value', function(dataSnapshot) {
            var vals = dataSnapshot.val()||{};
            if (endAtId) { 
              delete vals[endAtId]; // delete the extraneous record
            }
            // store $id in organization object; otherwise edit organiztion function breaks
            _.forEach(vals, function(v, k) {
              v.$id = k;
            });

            $scope.state.isLoading = false; 
            $timeout(function() {
              $scope.organizations = vals;
            }, 100);
        });
    }; 

    $scope.showPage = function _showPage() {
      $scope.state.isLoading = true;
      
      var itemPerPageSync = mainFactory.getChildRef('/itemPerPage');
      if (itemPerPageSync) {
        itemPerPageSync.once('value', function(snapshot) {
          $scope.itemPerPage = snapshot.val();
          loadNextPage(undefined);
        });
      }
    }

    $scope.state = {
      isLoading : false,
    };

    $scope.showOrganizationForm = function _showOrganizationForm() {
        
      $modal.open({
        keyboard : false,
        templateUrl: 'app/main/organizationModalContent.html',
        controller: ['$scope', '$modalInstance', '$q', 'mainFactory',
              function _modalController ($scope, $modalInstance, $q, mainFactory) { 

              $scope.isLoading = false;
        
              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

              $scope.refRecords = mainFactory.refRecords();

              $scope.addOrganization = function _addOrganization(isValid) {
                if (isValid) {
                  $scope.isLoading = true;
                  $scope.msgObj = {
                      message : '',
                      cssClassName : ''
                  };

                  handleAddOrganization().then(function(id) {
                    $scope.organization.name = '';
                    $scope.organization.shortname = '';
                    $scope.organization.description = '';
                    $scope.organization.website = '';
                    $scope.organization.facebook = '';
                    $scope.organization.meetup = '';

                    $scope.organizationForm.$setPristine($scope.organizationForm.shortname);
                    $scope.organizationForm.$setPristine($scope.organizationForm.name);
                    $scope.organizationForm.$setPristine($scope.organizationForm.desc);
                    $scope.organizationForm.$setPristine($scope.organizationForm.website);
                    $scope.organizationForm.$setPristine($scope.organizationForm.facebook);
                    $scope.organizationForm.$setPristine($scope.organizationForm.meetup);

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

              var handleAddOrganization = function _handleAddOrganization() {

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

              $scope.organization = {
                name : '',
                shortname : '',
                description : '',
                website : '',
                facebook : '',
                meetup : ''
              };
          }],
          size: 'lg',
      });
    };
  }])
  .controller('MainEditCtrl', ['$scope', '$state',  '$stateParams', 'mainFactory',
      function ($scope, $state, $stateParams, mainFactory) {

      $scope.isLoading = true;

      $scope.msgObj = {
        message : '',
        cssClassName : ''
      };

     var organization = mainFactory.retrieveOrganization($stateParams.id);
      organization.$loaded().then(
        function(data) {
          $scope.editObj = data;
          $scope.isLoading = false;
        }, function(error) {
          $scope.editObj = null;
          $scope.isLoading = false;
        }
      );
      
      $scope.save = function _save(isValid) {
        if (isValid) {
          $scope.isLoading = true;

          var editObj = {
                name : $scope.editObj.name,
                code : $scope.editObj.code,
                description : $scope.editObj.description,
                url : $scope.editObj.url,
                facebook : $scope.editObj.facebook,
                meetup : $scope.editObj.meetup,
                events : $scope.editObj.events
              };

          mainFactory.saveOrganization($scope.editObj.$id, editObj)
            .then(function(ref) {
                  $scope.isLoading = false;
                  $state.go('home');
                },
              function(error) {
                $scope.isLoading = false;
                $scope.msgObj.message = 'SAVE_ORG_ERROR_CODE';
                $scope.msgObj.cssClassName = 'danger';
            });
        }
      };

      $scope.cancel = function _cancel() {
        $state.go('home');
      };

  }]);
