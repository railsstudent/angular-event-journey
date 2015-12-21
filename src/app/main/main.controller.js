'use strict';

angular.module('angularEventJourney')
  .controller('MainCtrl', function ($scope, $q, $modal, $state, mainFactory) {

    // https://www.firebase.com/docs/web/libraries/angular/guide.html
    // https://www.firebase.com/docs/web/libraries/angular/quickstart.html

    // download organizations from firebase
    $scope.organizations = undefined;
    $scope.numOrganization = 0;
    $scope.currentPage = 0;
    $scope.itemPerPage = 0;
    $scope.promise = null;

    $scope.goToAboutMe = function _goToAboutMe() {
        $state.go('about_me', {}, { location : true });
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
          $scope.promise = loadNextPage(undefined);
          $scope.promise.then(function(data) {
              console.log('loadNextPage result: ' + data);
            });
        } else if (prevPage < $scope.currentPage) {
          console.log('Load next page');
          // get the key of the last organization
          var keys1 = _.keys($scope.organizations);
          var lastKey = keys1[keys1.length - 1];
          var startAtId = lastKey ? lastKey: undefined;
          prevPage = $scope.currentPage;
          $scope.promise = loadNextPage(startAtId);
          $scope.promise.then(function(data) {
              console.log('loadNextPage result: ' + data);
            });
        } else if (prevPage > $scope.currentPage) {
          console.log('Load previous page');
          // get the key of the first organization
          var keys2 = _.keys($scope.organizations);
          var firstKey = keys2[0];
          var endAtId = firstKey ? firstKey : undefined;
          prevPage = $scope.currentPage;
          $scope.promise = loadPrevPage(endAtId);
          $scope.promise.then(function (data) {
              console.log('loadPrevPage result: ' + data);
          });
        }
      }
    };

    var loadNextPage = function _loadNextPage(startAtId) {

      var itemPerPage = $scope.itemPerPage;
      itemPerPage = itemPerPage + (startAtId ? 1 : 0);

      var deferred = $q.defer();
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
            $scope.organizations = vals;
            deferred.resolve('success');
        });
        return deferred.promise;
    };

    var loadPrevPage = function _loadPrevPage(endAtId) {

      var itemPerPage = $scope.itemPerPage;
      itemPerPage = itemPerPage + (endAtId ? 1 : 0);

      var deferred = $q.defer();
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
            $scope.organizations = vals;
            deferred.resolve('success');
        });
        return deferred.promise;
    };

    var promiseLoadPage = $q.defer();
    $scope.promise = promiseLoadPage.promise;
    mainFactory.getChildRef('/itemPerPage').once('value', function(snapshot) {
      $scope.itemPerPage = snapshot.val();
      loadNextPage(undefined).then(function(data) {
        console.log('itemPerPage = ' + $scope.itemPerPage);
        console.log('call loadNextPage after itemPerPage: ' + data);
        promiseLoadPage.resolve(data);
      });
    });

    $scope.showOrganizationForm = function _showOrganizationForm() {

      $modal.open({
        keyboard : false,
        templateUrl: 'app/main/organizationModalContent.html',
        controller:  function _modalController ($scope, $modalInstance, $q, mainFactory) {

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

              $scope.refRecords = mainFactory.refRecords();

              $scope.addOrganization = function _addOrganization(isValid) {
                if (isValid) {
                  $scope.msgObj = {
                      message : '',
                      cssClassName : ''
                  };

                  $scope.promise = handleAddOrganization();
                  $scope.promise.then(function(id) {
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

                    $scope.msgObj.message = 'ADD_ORG_SUCCESS_CODE'; // 'Congratuation!!! Add organization is successful.';
                    $scope.msgObj.cssClassName = 'success';
                    $modalInstance.close();
                  }, function(error) {
                    $scope.msgObj.message = 'ADD_ORG_ERROR_CODE'; // 'Fail to add new organization.';
                    $scope.msgObj.cssClassName = 'danger';
                  });
                }
              };

              var handleAddOrganization = function _handleAddOrganization() {

//                  var deferred = $q.defer();
                  var newObj = { code : $scope.organization.shortname,
                        description : $scope.organization.description,
                        url : $scope.organization.website,
                        facebook : $scope.organization.facebook,
                        meetup : $scope.organization.meetup,
                        name : $scope.organization.name
                      };

                  /*mainFactory.addOrganization(newObj)
                      .then(function (ref) {
                          if (ref) {
                            deferred.resolve(ref.key());
                          } else {
                            deferred.reject('');
                          }
                      });
                  return deferred.promise;*/
                  var promise = mainFactory.addOrganization(newObj);
                  return promise;
              };

              $scope.organization = {
                name : '',
                shortname : '',
                description : '',
                website : '',
                facebook : '',
                meetup : ''
              };
          },
          size: 'lg',
      });
    };

    // http://stackoverflow.com/questions/24713242/using-ui-router-with-bootstrap-ui-modal
    $scope.removeOrganization =
      function _removeOrganization(organizationId) {
        var modalInstance = $modal.open({
          templateUrl: 'removeOrganiztion.html',
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
            mainFactory.removeOrganization(organizationId)
              .then(function(ref) {
                $state.go('home', {}, { reload: true });
              }, function(error) {
                $state.go('home', {}, { reload: true });
              });
          }
        });
    };
  })
  .controller('MainEditCtrl', function ($scope, $state, $stateParams, $q, mainFactory) {

      $scope.msgObj = {
        message : '',
        cssClassName : ''
      };

      $scope.promise = null;

     var organization = mainFactory.retrieveOrganization($stateParams.id);
     $scope.promise = organization.$loaded();
      $scope.promise.then(
        function(data) {
          $scope.editObj = data;
        }, function(error) {
          $scope.editObj = null;
        }
      );

      $scope.save = function _save(isValid) {
        if (isValid) {
          var editObj = {
                name : $scope.editObj.name,
                code : $scope.editObj.code,
                description : $scope.editObj.description,
                url : $scope.editObj.url,
                facebook : $scope.editObj.facebook,
                meetup : $scope.editObj.meetup,
                events : $scope.editObj.events ? $scope.editObj.events : null,
                event_counter : $scope.editObj.event_counter ? $scope.editObj.event_counter : 0
              };

            $scope.promise = mainFactory.saveOrganization($scope.editObj.$id, editObj);
            $scope.promise.then(function(ref) {
                  $state.go('home');
                },
              function(error) {
                $scope.msgObj.message = 'SAVE_ORG_ERROR_CODE';
                $scope.msgObj.cssClassName = 'danger';
            });
        }
      };

      $scope.cancel = function _cancel() {
        $state.go('home');
      };
  });
