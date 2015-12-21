'use strict';

var gulp = require('gulp');

// http://ericlbarnes.com/setting-gulp-bower-bootstrap-sass-fontawesome/
/*var bower = require('gulp-bower');

var config = {
    sassPath: './resources/sass',
    bowerDir: './bower_components'
}

gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});*/

// inject bower components
gulp.task('wiredep', function () {
  var wiredep = require('wiredep').stream;

  gulp.src('src/{app,components}/*.scss')
    .pipe(wiredep({
      directory: 'bower_components',
      ignorePath: /^\/|\.\.\//
    }))
    .pipe(gulp.dest('src'));

  gulp.src('src/*.html')
    .pipe(wiredep({
      directory: 'bower_components',
    //  exclude: ['bootstrap'],
      ignorePath: /^\/|\.\.\//
    }))
    .pipe(gulp.dest('src'));
});
