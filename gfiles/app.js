'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const Locations = require('./locations.js');


gulp.task('instrument-app', function() {
  gulp.src(Locations.app.src)
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});


gulp.task('test-app', ['instrument-app'], function() {
    return gulp.src(Locations.app.test)
      .pipe(mocha())
      .pipe(istanbul.writeReports({
        dir: Locations.app.coverage
      }))
      .pipe(istanbul.enforceThresholds({
        thresholds: {
          global: 90
        }
      }));
});


gulp.task('lint-app', function() {
  return gulp.src(Locations.app.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('build-app', ['lint-app'], function() {
  return gulp.src(Locations.app.src)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(Locations.app.dest));
});
