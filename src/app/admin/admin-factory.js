'use strict';
/**
 * @ngdoc service
 * @name angularEventJourney.admin
 * @description
 * # admin
 * Factory in the angularEventJourney.
 */
angular.module('angularEventJourney')
  .factory('adminFactory', function (mainFactory, $q) {
// Service logic
// ...
    var options = {
                    remember: 'sessionOnly',
                  };

    var mainRef = mainFactory.ref();

// Public API here
    return {
     
      authWithPassword : function _authWithPassword(user) {
        // return promise and handle authentication success and failure
        var deferred = $q.defer();

        // call firebase to authenticate
        mainRef.authWithPassword({
            email : user.email,
            password: user.password
        }, function(error, authData) {
            if (error) {
              deferred.reject(error);
            } else {
              // successfully authenticate user
              deferred.resolve(authData);
            }
        }, options);
        return deferred.promise;
      }, 

      logout : function _logout() {
      	mainRef.unauth();
      },

      authWithProvider : function _authWithProvider(provider) {
        var deferred = $q.defer();
        mainRef.authWithOAuthPopup(provider, 
          function(error, authData) {
            if (error) {
              if (error.code === 'TRANSPORT_UNAVAILABLE') {
                // fall-back to browser redirects, and pick up the session
                // automatically when we come back to the origin page
                ref.authWithOAuthRedirect(provider, 
                  function(error) { 
                    if (error) {
                      deferred.reject(error); 
                    } 
                  }, options);
              } else {
                deferred.reject(error);
              }
            } else if (authData) {
              deferred.resolve(authData);
            }
          }, options);
        return deferred.promise;        
      },

      getName : function _getName(authData) {
        if (!authData) {
          return '';
        }

        switch (authData.provider) {
          case 'password':
            return authData.password.email;
          case 'github':
            return authData.github.displayName;  
          case 'google':
            return authData.google.displayName;
        }
      }
    };
  });
