'use strict';

var gulp = require('gulp'),
  connect = require('gulp-connect'),
  less = require('gulp-less'),
  babel = require('gulp-babel'),
  gutil = require('gulp-util'),
  autoprefix = new (require('less-plugin-autoprefix'))();

gulp.task('server', function () {
  connect.server({
    port: 8000
  });
});

gulp.task('less', function () {
  return gulp.src('styles/*.less')
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest('css/'));
});

gulp.task('babel', function () {
  return gulp.src('js/src/*.js')
    .pipe(babel().on('error', function (e) {
      gutil.log('\n' + e.message + '\n' + e.codeFrame);
      this.emit('end');
    }))
    .pipe(gulp.dest('js/dist/'));
});

gulp.task('watch', function () {
  gulp.watch('styles/*.less', ['less']);
  gulp.watch('js/src/*.js', ['babel']);
});

gulp.task('default', ['less']);
