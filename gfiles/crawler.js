'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const { crawler } = require('./locations.js');


gulp.task('crawler', function () {
  return gulp.src(crawler.src)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(crawler.dest));
});


gulp.task('clean-crawler', function () {
  return del([crawler.clean]);
});