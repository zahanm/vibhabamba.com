'use strict';

var gulp = require('gulp'),
  connect = require('gulp-connect'),
  less = require('gulp-less'),
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

gulp.task('watch', function () {
  gulp.watch('styles/*.less', ['less']);
})

gulp.task('default', ['less']);
