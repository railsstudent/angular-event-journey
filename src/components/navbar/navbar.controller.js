'use strict';

angular.module('angularEventJourney')
  .controller('NavbarCtrl', ['$rootScope', '$scope', '$location', '$translate', 
  	function ($rootScope, $scope, $location, $translate) {
       //$scope.date = new Date();

       $scope.isActive = function(viewLocation) {
          return viewLocation === $location.path();
       }

       $scope.changeLanguage = function _changeLanguage(langKey) {
          //var langKey = _.isEqual($translate.use(), 'en') ? 'zh-hk' : 'en';
          console.log ('$translate.user() = ' + $translate.use());
          console.log ('langKey = ' + langKey);
          $translate.use(langKey);
       }

       $scope.logout = function _logout() {
          $rootScope.logout();
          alert ("You are log out.");
       }
  }]);
