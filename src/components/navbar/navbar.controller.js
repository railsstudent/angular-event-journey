'use strict';

angular.module('angularEventJourney')
  .controller('NavbarCtrl', ['$scope', '$location', '$translate',  
  	function ($scope, $location, $translate) {
       $scope.date = new Date();

       $scope.isActive = function(viewLocation) {
          return viewLocation === $location.path();
       }

       $scope.changeLanguage = function _changeLanguage() {
          var langKey = _.isEqual($translate.use(), 'en') ? 'zh-hk' : 'en';
          console.log ('$translate.user() = ' + $translate.use());
          console.log ('langKey = ' + langKey);
          $translate.use(langKey);
       }
  }]);
