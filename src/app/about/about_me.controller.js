'use strict';

angular.module('angularEventJourney')
  .controller('AboutCtrl', ['$scope', '$q', '$firebase',
      'mainFactory', 
      function ($scope, $q, $firebase, mainFactory) {

      var fnIdentity = function(x) { return x; };

      var isObject = function(s) { return s != null && s != undefined; };

      $scope.me = {};

      $scope.isLoading = false;

      $scope.showPage = function _showPage() {
            $scope.isLoading = true;
             showPageWithPromise().then(function(meObject) {
                $scope.me.description = meObject.description;
                // remove null or undefined object
                meObject.servers = _.remove(meObject.servers, isObject);
                $scope.me.servers =  _.sortBy(meObject.servers, fnIdentity);

                meObject.databases =_.remove(meObject.databases, isObject);
                $scope.me.databases =  _.sortBy(meObject.databases, fnIdentity);
                
                $scope.me.frameworks = meObject.frameworks;
                $scope.me.frameworks.icons = _.remove($scope.me.frameworks.icons, isObject);
                $scope.me.frameworks.list = _.remove($scope.me.frameworks.list, isObject);
                $scope.me.frameworks.list = _.sortBy($scope.me.frameworks.list, fnIdentity);

                $scope.me.skills = meObject.skills;
                $scope.me.skills.icons = _.remove($scope.me.skills.icons, isObject); 
                $scope.me.skills.list = _.remove($scope.me.skills.list, isObject);
                $scope.me.skills.list = _.sortBy($scope.me.skills.list, fnIdentity);

                $scope.me.machines = meObject.machines;
                $scope.me.machines.icons = _.remove($scope.me.machines.icons, isObject); 
                $scope.me.socialMedia =_.remove(meObject.socialMedia, isObject);

                $scope.me.mobile = meObject.mobile;
                $scope.me.mobile.icons =_.remove($scope.me.mobile.icons, isObject);
                $scope.me.mobile.list =_.remove($scope.me.mobile.list, isObject);
                $scope.me.mobile.list =_.sortBy($scope.me.mobile.list, fnIdentity);

                $scope.isLoading = false;
             }, function(error) {
                $scope.isLoading = false;
                alert(error.message);
             });
      }; 

      var showPageWithPromise = function _showPageWithPromise() {
        var deferred = $q.defer();
        var aboutMe = $firebase(mainFactory.refSkill()).$asObject();
        aboutMe.$loaded().then (function(data) {
             deferred.resolve(data); 
          }, function(error) {
              deferred.reject(error);
          });
          return deferred.promise;  
      };
  }]);
