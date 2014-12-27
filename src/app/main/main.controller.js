'use strict';

angular.module('angularEventJourney')
  .controller('MainCtrl', ['$scope' , '$location', '$anchorScroll', 
      'mainFactory', '$firebase',
     function ($scope, $location, $anchorScroll, mainFactory, $firebase) {

    // https://www.firebase.com/docs/web/libraries/angular/guide.html
    // https://www.firebase.com/docs/web/libraries/angular/quickstart.html

    // download organizations from firebase
    $scope.organizations = $firebase(mainFactory.refOrganization()).$asArray();

  }]);
