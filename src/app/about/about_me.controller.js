'use strict';

angular.module('angularEventJourney')
  .controller('AboutCtrl', ['$scope', function ($scope) {

      var fn_identity = function(x) { return x; };

      // to do: convert to firebase entity

      $scope.me = { 
          description : 'A developer who loves to build web and mobile applications at work and in free time. ',
          machines: {   'text': 'Own a Mac Book Air and Ubuntu machine for coding at home or in hackathons' 
                      , 'icons' : [ 'fa-desktop', 'fa-apple', 'fa-linux' ]
                    },
          skills :  { 'list': _.sortBy([ 'Android',  'Java' ,  'JavaScript'  ,  'JQuery/JQuery UI' ,  'SQL' ,  
                          'XML/XPath/XSLT',  'HTML/HTML 5', 'Scala', 'PHP/ Python', 'VBA/VB6', 'C#' , 'CSS' ], 
                          fn_identity)
                       , 'icons' : [ 'fa-code', 'fa-keyboard-o' ]
                    }, 
          frameworks : { 
                      'list' : _.sortBy([ 'AngularJS', 'JPA', 'Bootstrap 3'
                          , 'Servlet', 'JSP' , 'Apache Tiles' , 'Struts', 
                          'Android Facebook', 'Spring' ], fn_identity),
                      'icons' : [ 'fa-android', 'fa-facebook-square' ]  
                  },
          databases : _.sortBy( [ 'MySQL', 'SQL Server', 'MongoDB', 'Oracle', 'DB2'], fn_identity), 
          servers : [ 'Tomcat', 'Apache' ],
          socialMedia : [   { type : 'github',  icon : 'fa-github-square', url : 'https://github.com/railsstudent' }
                           , { type : 'twitter', icon : 'fa-twitter-square', url : 'https://twitter.com/con_leung' }
                         ]
      };

  }]);
