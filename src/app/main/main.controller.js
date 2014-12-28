'use strict';

angular.module('angularEventJourney')
  .controller('MainCtrl', ['$scope' , '$location', '$anchorScroll', 
      'mainFactory', '$firebase',
     function ($scope, $location, $anchorScroll, mainFactory, $firebase) {

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
        alert ("valid, yipeeee");
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

                } else {
                    $scope.organization.name = '';
                    $scope.organization.shortname = '';
                    $scope.organization.description = '';
                    $scope.organization.website = '';
                    $scope.organization.facebook = '';
                    $scope.organization.meetup = '';
                }
            });
      }
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
