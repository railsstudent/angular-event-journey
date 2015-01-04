'use strict';

var app = angular.module('angularEventJourney',
 ['ngCookies', 'ngSanitize', 'restangular', 'ui.router', 
 'ui.bootstrap', 'pascalprecht.translate', 'firebase', 'restangular']);

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
        url: '/events/:organization/:desc',
        templateUrl: 'app/event/event.html',
        controller : 'EventCtrl'
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
    .run (['$rootScope', 'mainFactory', 'adminFactory',   
        function($rootScope, mainFactory, adminFactory) {
    // http:technologyckoverflow.com/questions/20978248/angularjs-conditional-routing-in-app-config
        $rootScope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams){
            if ( toState.name === 'admin' && $rootScope.authData) {
                event.preventDefault();
                return false;
            }
        });

        $rootScope.login = adminFactory.authWithPassword;

        $rootScope.logout = adminFactory.logout;

        mainFactory.ref().onAuth(function(authData) {
            if (authData) {
                console.log('Client is authenticated.', authData.uid);
                $rootScope.authData = authData;
            } else {
                $rootScope.authData = null;
                console.log('Client is unauthenticated.');
            }
        });
   }]);

app.config(['$translateProvider', function($translateProvider) {

  var enTexts = {
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
    'PASSION_WEB_DEV' : 'Passionate about web development',
    'LOVE_TO_CODE' : 'Love to code pet projects to learn JS Frameworks and J2EE',
    'HOBBY' : 'Always a pleasure to attend local technology community events and talk to peers with similar background',
    'BACK_HOME' : 'Back home',
    'TITLE' : 'My Hobby',
    'LANGUAGE' : 'Language',
    'ENGLISH' : 'English',
    'CHINESE' : 'Trad. Chinese',
    'WEB_SITE' : 'Web site:  ',
    'SHORT_NAME': 'Code:   ',
    'YOUR_EMAIL_IS_REQUIRED' : 'Enter a valid email.',
    'YOUR_PASSWORD_IS_REQUIRED' : 'Your password is required.',
    'EMAIL' : 'Email',
    'PASSWORD' : 'Password',
    'EMAIL_PLACEHOLDER' : 'Email',
    'PASSWORD_PLACEHOLDER' : 'Password',
    'SIGN_IN' : 'Please Sign In',
    'DESCRIPTION' : 'Description:',
    'LOADING' : 'Loading...',
    'NAME' : 'Name: ',
    'ADD_ORGANIZATION' : 'Add Organization',
    'EDIT_ORGANIZATION' : 'Edit Organization',
    'ADD' : 'Add',
    'CANCEL' : 'Cancel',
    'EDIT' : 'Edit',
    'SAVE' : 'Save',
    'ADD_ORG_SUCCESS_CODE' : 'Congratuation!!! Add organization is successful.',
    'ADD_ORG_ERROR_CODE' :  'Fail to add new organization.',
    'SAVE_ORG_ERROR_CODE' : 'Error!!! Organization is not saved.',
    'NUM_ORG' : 'Number of Organizations: {{value}}',
    'TECH' : 'Technology',
    'MOBILE' : 'Mobile Platform'
  };

  var hkTexts = {
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
    'PASSION_WEB_DEV' : '熱愛網站開發',
    'LOVE_TO_CODE' : '喜歡編寫代碼，學習JavaScript框架及J2EE',
    'HOBBY' : '喜歡參加當地技術社區活動，跟類似背景的同行談話',
    'BACK_HOME' : '返回首頁',
    'TITLE' : '嗜好',
    'LANGUAGE' : '語言',
    'ENGLISH' : '英文',
    'CHINESE' : '中文',
    'WEB_SITE' : '網站：  ',
    'SHORT_NAME' : '簡稱：  ',
    'EMAIL' : '電子郵件：   ',
    'PASSWORD' : '密碼：   ',
    'EMAIL_PLACEHOLDER' : '電子郵件',
    'PASSWORD_PLACEHOLDER' : '密碼',
    'SIGN_IN' : '請登錄',
    'DESCRIPTION' : '介紹：',
    'LOADING' : '載入中...',
    'NAME' : '名稱：   ',
    'ADD_ORGANIZATION' : '增加組織',
    'EDIT_ORGANIZATION' : '修改組織',
    'ADD' : '增加',
    'CANCEL' : '取消',
    'EDIT' : '修改',
    'SAVE' : '另存',
    'NUM_ORG' : '機構數目：{{value}}',
    'TECH' : '科技',
    'MOBILE' : '移動平台'
  };

  // register translation table
  $translateProvider.translations('en', enTexts);
  $translateProvider.translations('zh-hk', hkTexts);

   // which language to use?
   // fallback language
  $translateProvider.preferredLanguage('zh-hk')
    .fallbackLanguage('en');
}]);
