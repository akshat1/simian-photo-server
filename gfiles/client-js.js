'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const browserify = require('browserify');
const babelify = require('babelify');
const fs = require('fs-extra');
const path = require('path');
const Locations = require('./locations.js');


gulp.task('instrument-client-js', function() {
  gulp.src(Locations.client.js.src)
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});


gulp.task('test-client-js', ['instrument-client-js'], function() {
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


gulp.task('lint-client-js', function() {
  return gulp.src(Locations.client.js.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


gulp.task('build-client-js', ['lint-client-js'], function() {
  fs.ensureDirSync(path.dirname(Locations.client.js.dest));
  return browserify(Locations.client.js.entry, {
      debug: true
    })
    .transform(babelify.configure())
    .bundle()
    .pipe(fs.createWriteStream(Locations.client.js.dest));
});
