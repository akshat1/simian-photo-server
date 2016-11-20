'use strict'; // eslint-disable-line strict

const gulp = require('gulp');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const { server } = require('./locations.js');


gulp.task('server', function () {
  return gulp.src(server.src)
    .pipe(changed(server.dest))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(server.dest));
});


gulp.task('clean-server', function () {
  return del([server.clean]);
});
