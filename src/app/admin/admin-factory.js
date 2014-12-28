'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.admin
 * @description
 * # admin
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('adminFactory', ['mainFactory','$q', function (mainFactory, $q) {
// Service logic
// ...
// Public API here
    return {
     
      authWithPassword : function _authWithPassword(user) {
        // return promise and handle authentication success and failure
        var deferred = $q.defer();

        // call firebase to authenticate
        mainFactory.ref().authWithPassword({
            email : user.email,
            password: user.password
        }, function(error, authData) {
            if (error) {
              deferred.reject(error);
            } else {
              // successfully authenticate user
              deferred.resolve(authData);
            }
        }, {
            remember : 'sessionOnly'
        });
        return deferred.promise;
      }, 

      logout : function _logout() {
      	mainFactory.ref().unauth();
      }
    };
  }]);
