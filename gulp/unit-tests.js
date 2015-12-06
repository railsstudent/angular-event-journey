'use strict';

var gulp = require('gulp');
var Server = require('karma').Server;

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep');

gulp.task('test', function(done) {
   new Server({
      configFile: __dirname  + '/../test/karma.conf.js',
      singleRun: true
    }, done).start();
});
