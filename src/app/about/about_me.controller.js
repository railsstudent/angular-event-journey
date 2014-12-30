'use strict';

angular.module('angularEventJourney')
  .controller('AboutCtrl', ['$scope', '$activityIndicator', '$q', '$firebase',
      'mainFactory', 
      function ($scope, $activityIndicator, $q, $firebase, mainFactory) {

      var fn_identity = function(x) { return x; };

      // to do: convert to firebase entity
      $scope.me = {
        description : '',
        machines : {},
        skills : {},
        frameworks : { list: [], icons : [] },
        databases : [],
        servers : [],
        socialMedia : []
      };

      $scope.showPage = function _showPage() {
         $activityIndicator.startAnimating(); 
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
            $activityIndicator.stopAnimating(); 
         }, function(error) {
            $activityIndicator.stopAnimating(); 
            alert(error.message);

         });
      }; 

      var showPageWithPromise = function _showPageWithPromise() {
        var deferred = $q.defer();
        $activityIndicator.startAnimating(); 
        var aboutMe = $firebase(mainFactory.refSkill()).$asObject();
        aboutMe.$loaded().then (function(data) {
             deferred.resolve(data); 
          }, function(error) {
              deferred.reject(error);
          });
          return deferred.promise;  
      }

/*      $scope.me = { 
          socialMedia : [   { type : 'github',  icon : 'fa-github-square', url : 'https://github.com/railsstudent' }
                           , { type : 'twitter', icon : 'fa-twitter-square', url : 'https://twitter.com/con_leung' }
                         ]
      };
*/
  }]);
