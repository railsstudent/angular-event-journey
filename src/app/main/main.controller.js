'use strict';

angular.module('angularEventJourney')
  .controller('MainCtrl', ['$scope' , '$location', '$anchorScroll', 
       '$firebase', '$q', '$modal', '$timeout', 'mainFactory', 'mainService',
     function ($scope, $location, $anchorScroll, $firebase, $q, $modal, $timeout,
        mainFactory, mainService) {

    // https://www.firebase.com/docs/web/libraries/angular/guide.html
    // https://www.firebase.com/docs/web/libraries/angular/quickstart.html

    // download organizations from firebase
    $scope.organizations = []; 

    $scope.scrollToElement = function _scrollToElement(elementId) {
      $location.hash(elementId);
      $anchorScroll();
    };

    $scope.showPage = function _showPage() {
      $scope.state.isLoading = true;
      $scope.organizations = $firebase(mainFactory.refOrganization()).$asArray();
      $scope.organizations.$loaded().then(
        function() {
          $scope.state.isLoading = false;
          _.each($scope.organizations, function(o) {
            mainService.setEditObjState(o.$id, false);
          });
        }, 
        function() {
          $scope.state.isLoading = false;
        }
      );
    };

    $scope.isEditState = function _isEditState(key) {
      return mainService.getEditObjState(key);
    }

    $scope.edit = function _edit(key) {
      mainService.setEditObjState(key, true);
    }

    $scope.save = function _save(key, isValid) {
      if (isValid) {
        mainService.setEditObjState(key, false);
        $scope.state.editObj.name = '';
        $scope.state.editObj.shortname = '';
        $scope.state.editObj.description = '';
        $scope.state.editObj.website = '';
        $scope.state.editObj.facebook = '';
        $scope.state.editObj.meetup = '';
      }
    }

    $scope.cancel = function _cancel(key) {
      mainService.setEditObjState(key, false);
    }

    $scope.state = {
      isEditing : [],
      isLoading : false,
      editObj : {
        name : '',
        shortname : '',
        description : '',
        website : '',
        facebook : '',
        meetup : ''
      }
    };



    $scope.showOrganizationForm = function _showOrganizationForm() {
        
        var modalInstance = $modal.open({
          keyboard : false,
          templateUrl: 'app/main/organizationModalContent.html',
          controller: ['$scope', '$modalInstance', '$q', 
              function _modalController ($scope, $modalInstance, $q) { 

              $scope.isLoading = false;

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
                    $scope.msgObj.cssClassName = 'alert-success';

                    $timeout(function() {
                      $modalInstance.close();
                    }, 1500);
                  }, function(error) {
                    $scope.isLoading = false;
                    $scope.msgObj.message = 'Fail to add new organization.';
                    $scope.msgObj.cssClassName = 'alert-danger';
                  });
                }
              }

              var handleAddOrganization = function _handleAddOrganization() {

                  var deferred = $q.defer();
                  $firebase(mainFactory.refOrganization()).$asArray()
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

  }]);
