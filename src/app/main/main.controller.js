'use strict';

angular.module('angularEventJourney')
  .controller('MainCtrl', ['$scope' , '$location', '$anchorScroll', 
      'mainFactory', '$firebase', '$q',
     function ($scope, $location, $anchorScroll, mainFactory, $firebase, $q) {

    // https://www.firebase.com/docs/web/libraries/angular/guide.html
    // https://www.firebase.com/docs/web/libraries/angular/quickstart.html

    // download organizations from firebase
    $scope.organizations = $firebase(mainFactory.refOrganization()).$asArray();

    $scope.scrollToElement = function _scrollToElement(elementId) {
      $location.hash(elementId);
      $anchorScroll();
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
        }, function(error) {
          alert('Add organization failed: ' + error.message);
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
    }

    $scope.organization = {
      name : '',
      shortname : '',
      description : '',
      website : '',
      facebook : '',
      meetup : ''
    };

  }]);
