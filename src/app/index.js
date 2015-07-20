'use strict';

var app = angular.module('angularEventJourney',
 ['ngCookies', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate', 
 'firebase', 'cgBusy', 'angularMoment']);

app.config(['$stateProvider', '$urlRouterProvider', 
    function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('home_edit', {
        url: '/home/:id',
        templateUrl: 'app/main/main.edit.html',
        controller: 'MainEditCtrl'
      })
	  .state('about_me', {
        url: '/about_me',
        templateUrl: 'app/about/about_me.html',
        controller: 'AboutCtrl'
      })
    .state('events', {
        url: '/organization/:organizationId/events',
        templateUrl: 'app/event/event.html',
        controller : 'EventCtrl as ev'
      })
    .state('admin', {
        url: '/admin',
        templateUrl: 'app/admin/admin.html',
        controller: 'AdminCtrl'
      })
    .state('technology', {
        url: '/technology',
        templateUrl: 'app/technology/technology.html',
        controller: 'technologyCtrl'
      });

    $urlRouterProvider.otherwise('/home');
  }])
    .run (['$rootScope', '$state', 'mainFactory', 'adminFactory',   
        function($rootScope, $state, mainFactory, adminFactory) {
    // http:technologyckoverflow.com/questions/20978248/angularjs-conditional-routing-in-app-config
        $rootScope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams){
              console.log('fromState.name = ' + fromState.name 
                  + ', toState.name = ' + toState.name)
              if ( toState.name === 'admin' && $rootScope.authData) {
                  event.preventDefault();
                  return false;
              }
              $state.$current.name = toState.name;
              console.log('$state.$current.name = ' + $state.$current.name);
          });

        $rootScope.login = adminFactory.authWithPassword;
        $rootScope.thirdPartyLogin = adminFactory.authWithProvider;
        $rootScope.logout = adminFactory.logout;
        $rootScope.getName = adminFactory.getName;

        mainFactory.ref().onAuth(function(authData) {
            if (authData) {
                console.log('Client is authenticated.', authData.uid);
                $rootScope.authData = authData;
                $rootScope.displayName = $rootScope.getName(authData);
                if ($state.is('admin')) {
                  $state.go('home');
                }
            } else {
                $rootScope.authData = null;
                $rootScope.displayName = null;
                console.log('Client is unauthenticated.');
            }
        });
   }]);

app.config(['$translateProvider', function($translateProvider) {

  // which language to use?
  // fallback language
  $translateProvider.useStaticFilesLoader({
    prefix: 'app/locale-',
    suffix: '.json'
  }).preferredLanguage('zh-hk')
    .fallbackLanguage('en')
    .useSanitizeValueStrategy('escaped')
    .useMissingTranslationHandlerLog();
}]);
