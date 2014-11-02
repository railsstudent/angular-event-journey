'use strict';

angular.module('angularEventJourney',
 ['ngSanitize', 'restangular', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('/');
  })
;
