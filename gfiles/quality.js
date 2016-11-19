'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');
const mocha = require('gulp-mocha');

const locations = require('./locations.js');


function combineArrays(...arrays) {
  let res = [];
  for (let arr of arrays) {
    if (!Array.isArray(arr))
      arr = [arr];
    res = res.concat(arr);
  }
  console.log(res);
  return res;
}


function getAllJSPaths() {
  return combineArrays(locations.client.js.src, locations.server.src, locations.crawler.src);
}


gulp.task('instrument-js', function () {
  gulp.src(getAllJSPaths())
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});


gulp.task('test-js', ['instrument-js'], function () {
  return gulp.src(locations.test.src)
    .pipe(mocha())
    .pipe(istanbul.writeReports({
      dir: locations.test.coverage
    }))
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        global: 90
      }
    }));
});


gulp.task('lint-js', function () {
  return gulp.src(getAllJSPaths())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
