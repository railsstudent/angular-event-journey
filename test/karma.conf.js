'use strict';

module.exports = function(config) {

  config.set({
    basePath : '..', //!\\ Ignored through gulp-karma //!\\

    files : [ //!\\ Ignored through gulp-karma //!\\
        'bower_components/angular/angular.js',
        'src/{app,components}/**/*.js',
        'test/unit/**/*.js'
    ],

    autoWatch : false,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
        'karma-phantomjs-launcher',
        'karma-jasmine'
    ]
  });

};
