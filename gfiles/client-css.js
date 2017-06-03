'use strict'; // eslint-disable-line strict

const gulp = require('gulp');
const sourceMaps = require('gulp-sourcemaps');
const { client } = require('./locations.js');
const less = require('gulp-less');

const lessOpts = {};

gulp.task('client-css', function () {
  return gulp
    .src(client.css.src)
    .pipe(sourceMaps.init())
    .pipe(less(lessOpts))
    .pipe(sourceMaps.write('.'))
    .pipe(gulp.dest(client.css.dest));
});
