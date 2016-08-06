'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const Locations = require('./locations.js');


gulp.task('instrument-client', function() {
  gulp.src(Locations.client.js.src)
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});


gulp.task('test-client', ['instrument-client'], function() {
    return gulp.src(Locations.client.js.test)
      .pipe(mocha())
      .pipe(istanbul.writeReports({
        dir: Locations.client.js.coverage
      }))
      .pipe(istanbul.enforceThresholds({
        thresholds: {
          global: 90
        }
      }));
});


gulp.task('lint-client', function() {
  return gulp.src(Locations.client.js.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('build-client', ['lint-client'], function() {
  return gulp.src(Locations.client.js.src)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(Locations.client.js.dest));
});
