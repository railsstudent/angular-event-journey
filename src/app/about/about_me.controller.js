'use strict';

angular.module('angularEventJourney')
  .controller('AboutCtrl', ['$scope', '$q', '$firebase',
      'mainFactory', '$timeout',
      function ($scope, $q, $firebase, mainFactory, $timeout) {

      var fn_identity = function(x) { return x; };

      $scope.me = {
        description : '',
        machines : {},
        skills : {},
        frameworks : { list: [], icons : [] },
        databases : [],
        servers : [],
        socialMedia : []
      };

      $scope.isLoading = false;

      $scope.showPage = function _showPage() {
            $scope.isLoading = true;
             showPageWithPromise().then(function(meObject) {
                $scope.me.description = meObject.description;
                $scope.me.servers =  _.sortBy(meObject.servers, fn_identity);
                $scope.me.databases =  _.sortBy(meObject.databases, fn_identity);
                $scope.me.frameworks = meObject.frameworks;
                $scope.me.frameworks.list = _.sortBy($scope.me.frameworks.list, fn_identity);
                $scope.me.skills = meObject.skills;
                $scope.me.skills.list = _.sortBy($scope.me.skills.list, fn_identity);
                $scope.me.machines = meObject.machines;
                $scope.me.socialMedia = meObject.socialMedia;
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
      }
  }]);
