'use strict';

var app = angular.module('angularEventJourney',
 ['ngAnimate', 'ngCookies', 'ngSanitize', 'restangular', 'ui.router', 
 'ui.bootstrap', 'pascalprecht.translate']);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
	  .state('about_me', {
        url: '/about_me',
        templateUrl: 'app/about/about_me.html',
        controller: 'AboutCtrl'
      })
    .state('events', {
        url: '/events/:organization/:desc',
        templateUrl: 'app/event/event.html',
        controller: 'EventCtrl'
      });
    $urlRouterProvider.otherwise('/home');
  }]);

app.config(['$translateProvider', function($translateProvider) {

  var en_texts = {
    'SKILL': 'Skills',
    'FRAMEWORK': 'Frameworks',
    'DATABASE' : 'Databases',
    'SERVER' : 'Servers',
    'DESC' : 'Description',
    'DEVMACHINE' : 'Development Machines',
    'SOCIALMEDIA' : 'Social Media',
    'SWITCH_LANGUAGE' : 'Trad. Chinese',
    'CHANGE_LANG': 'Language:',
    'HOME' : 'Home',
    'ABOUT' : 'About',
    'ABOUT_ME' : 'About Me',
    'LEARN_MORE' : 'Learn More',
    'PASSION_WEB_DEV' : 'Passionate about Software Development',
    'LOVE_TO_CODE' : 'Love to code pet projects to learn JS web frameworks',
    'HOBBY' : 'Always a pleasure to attend local technology community events and talk to peers with similar background',
    'BACK_HOME' : 'Back home'
  };

  var hk_texts = {
    'SKILL': '技能',
    'FRAMEWORK': '框架',
    'DATABASE' : '數據庫',
    'SERVER' : '伺服器',
    'DESC' : '介紹',
    'DEVMACHINE' : '開發機器',
    'SOCIALMEDIA' : '社交媒體',
    'SWITCH_LANGUAGE' : '英文',
    'CHANGE_LANG' : '語言：',
    'HOME' : '首頁',
    'ABOUT' : '關於',
    'ABOUT_ME' : '關於我',
    'LEARN_MORE' : '了解更多',
    'PASSION_WEB_DEV' : '熱愛軟件開發',
    'LOVE_TO_CODE' : '喜歡編寫代碼，學習JavaScript框架',
    'HOBBY' : '喜歡參加當地技術社區活動，跟類似背景的同行談話',
    'BACK_HOME' : '返回首頁'

  };

  // register translation table
  $translateProvider.translations('en', en_texts);
  $translateProvider.translations('zh-hk', hk_texts);


  // which language to use?
  $translateProvider.preferredLanguage('zh-hk');
}]);
