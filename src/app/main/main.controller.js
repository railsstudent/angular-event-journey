'use strict';

angular.module('angularEventJourney')
  .controller('MainCtrl', ['$scope' , '$location', '$anchorScroll', 
      'mainFactory', '$firebase', '$q', '$modal',
     function ($scope, $location, $anchorScroll, mainFactory, $firebase, $q, $modal) {

    // https://www.firebase.com/docs/web/libraries/angular/guide.html
    // https://www.firebase.com/docs/web/libraries/angular/quickstart.html

    // download organizations from firebase
    $scope.organizations = []; 

    $scope.scrollToElement = function _scrollToElement(elementId) {
      $location.hash(elementId);
      $anchorScroll();
    };

    $scope.isLoading = false;

    $scope.showPage = function _showPage() {
      $scope.isLoading = true;
      $scope.organizations = $firebase(mainFactory.refOrganization()).$asArray();
      $scope.organizations.$loaded().then(
        function() {
          $scope.isLoading = false;
        }, 
        function() {
          $scope.isLoading = false;
        }
      );
    };

    $scope.showOrganizationForm = function _showOrganizationForm() {
        
        var modalInstance = $modal.open({
          keyboard : false,
          templateUrl: 'app/main/organizationModalContent.html',
          controller: function _modalController ($scope, $modalInstance, $q) { 

              $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
              };

              $scope.addOrganization = function _addOrganization(isValid) {
                if (isValid) {
                  handleAddOrganization().then(function(val) {
                    $scope.organization.name = val;
                    $scope.organization.shortname = val;
                    $scope.organization.description = val;
                    $scope.organization.website = val;
                    $scope.organization.facebook = val;
                    $scope.organization.meetup = val;

                    $scope.organizationForm.$setPristine($scope.organizationForm.shortname);
                    $scope.organizationForm.$setPristine($scope.organizationForm.name);
                    $scope.organizationForm.$setPristine($scope.organizationForm.desc);
                    $scope.organizationForm.$setPristine($scope.organizationForm.website);
                    $scope.organizationForm.$setPristine($scope.organizationForm.facebook);
                    $scope.organizationForm.$setPristine($scope.organizationForm.meetup);
                  
                    $modalInstance.close('Add organization is successful.');
                  }, function(error) {
                    $modalInstance.close(error.message);  
                  });
                }
              }

              var handleAddOrganization = function _handleAddOrganization() {

                  var deferred = $q.defer();
                  mainFactory.refOrganization()
                    .child($scope.organization.shortname)
                    .set({ code : $scope.organization.shortname,
                        description : $scope.organization.description,
                        url : $scope.organization.website, 
                        facebook : $scope.organization.facebook, 
                        meetup : $scope.organization.meetup,
                        name : $scope.organization.name 
                      }, function (error) {
                          if (error) {
                            deferred.reject(error);
                          } else {
                            deferred.resolve('');
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
          },
          size: 'lg',
        });

        modalInstance.result.then(function (strMessage) {
          alert(strMessage);
        });
    };

  }]);
