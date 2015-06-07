'use strict';

angular.module('angularEventJourney')
  .controller('NavbarCtrl', ['$rootScope', '$scope', '$location', '$translate', '$modal', '$anchorScroll', 
  	function ($rootScope, $scope, $location, $translate, $modal, $anchorScroll) {

       $scope.isActive = function(viewLocation) {
          return viewLocation === $location.path();
       };

       $scope.changeLanguage = function _changeLanguage(langKey) {
          //var langKey = _.isEqual($translate.use(), 'en') ? 'zh-hk' : 'en';
          console.log ('$translate.use() = ' + $translate.use());
          console.log ('langKey = ' + langKey);
          $translate.use(langKey);
       };

       $scope.logout = function _logout() {
          $rootScope.logout();
          $modal.open({
            keyboard : false,
            templateUrl: 'components/navbar/logout.html',
            controller: ['$scope', '$modalInstance',
                function _modalController ($scope, $modalInstance) { 
                  $scope.ok = function () {
                    $modalInstance.close('logout');
                  };
                }],
              size: 'sm',
          });
       };

      $scope.moveToTop = function _moveToTop() {
          $location.hash("pageTop");
          $anchorScroll();
      };
  }]);
