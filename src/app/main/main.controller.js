'use strict';

angular.module('angularEventJourney')
  .controller('MainCtrl', ['$scope' , '$location', '$anchorScroll', 
       '$q', '$modal', '$timeout',  'organizationSync',
     function ($scope, $location, $anchorScroll, $q, $modal, $timeout, organizationSync) {

    // https://www.firebase.com/docs/web/libraries/angular/guide.html
    // https://www.firebase.com/docs/web/libraries/angular/quickstart.html

    // download organizations from firebase
    $scope.organizations = []; 

    $scope.organizationSync = organizationSync;

    $scope.scrollToElement = function _scrollToElement(elementId) {
      $location.hash(elementId);
      $anchorScroll();
    };

    $scope.showPage = function _showPage() {
      $scope.state.isLoading = true;
      $scope.organizations = $scope.organizationSync.$asArray();
      $scope.organizations.$loaded().then(
        function() {
          $scope.state.isLoading = false;
        }, 
        function() {
          $scope.state.isLoading = false;
        }
      );
    };

    $scope.state = {
      isLoading : false,
    };

    $scope.showOrganizationForm = function _showOrganizationForm() {
        
      var modalInstance = $modal.open({
        keyboard : false,
        templateUrl: 'app/main/organizationModalContent.html',
        resolve : {
          organizationSync : ['$firebase', 'mainFactory', 
            function($firebase, mainFactory) {
              return $firebase(mainFactory.refOrganization());
          }]
        },
        controller: ['$scope', '$modalInstance', '$q', 'organizationSync',
              function _modalController ($scope, $modalInstance, $q, organizationSync) { 

              $scope.isLoading = false;
              $scope.organizationSync = organizationSync;

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

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

                    $scope.isLoading = false;
                    $scope.msgObj.message = 'Congratuation!!! Add organization is successful.';
                    $scope.msgObj.cssClassName = 'success';

                    $timeout(function() {
                      $modalInstance.close();
                    }, 1500);
                  }, function(error) {
                    $scope.isLoading = false;
                    $scope.msgObj.message = 'Fail to add new organization.';
                    $scope.msgObj.cssClassName = 'danger';
                  });
                }
              }

              var handleAddOrganization = function _handleAddOrganization() {

                  var deferred = $q.defer();
                  $scope.organizationSync.$asArray()
                    .$add({ code : $scope.organization.shortname,
                        description : $scope.organization.description,
                        url : $scope.organization.website, 
                        facebook : $scope.organization.facebook, 
                        meetup : $scope.organization.meetup,
                        name : $scope.organization.name 
                      }).then(function (ref) {
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
  .controller('MainEditCtrl', ['$scope', 'organizationArrayPromise',
      'organizationSync', '$state',  '$stateParams',
      function ($scope, organizationArrayPromise, organizationSync, $state, $stateParams) {

      $scope.isLoading = true;

      $scope.msgObj = {
        message : '',
        cssClassName : ''
      };

      $scope.editObj = null;

      organizationArrayPromise.$loaded().then(
        function(data) {
          $scope.editObj = data.$getRecord($stateParams.id);
          $scope.isLoading = false;
        }, function(error) {
          $scope.isLoading = false;
        }
      );

      $scope.organizationSync = organizationSync;
      
      $scope.save = function _save(isValid) {
        if (isValid) {
          $scope.isLoading = true;

          $scope.organizationSync
            .$set($scope.editObj.$id, 
              {
                name : $scope.editObj.name,
                code : $scope.editObj.code,
                description : $scope.editObj.description,
                url : $scope.editObj.url,
                facebook : $scope.editObj.facebook,
                meetup : $scope.editObj.meetup,
              })
            .then(function(ref) {
                $scope.isLoading = false;
                $state.go('home');
              }, 
              function(error) {
                $scope.isLoading = false;
                $scope.msgObj.message = 'Error!!! Organization is not saved.';
                $scope.msgObj.cssClassName = 'danger';
            });
        }
      };

      $scope.cancel = function _cancel() {
        $state.go('home');
      }

  }]);
