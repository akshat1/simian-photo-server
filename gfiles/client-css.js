'use strict';

const gulp = require('gulp');
const postCSS = require('gulp-postcss');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const Locations = require('./locations.js');

const FILE_SEPARATOR = '\n\n/* **** **** **** **** **** **** **** **** **** **** **** **** **** */\n\n';


gulp.task('css', function() {
  return gulp.src(Locations.client.css.src)
    .pipe(sourcemaps.init())
    .pipe(postCSS([
      require('postcss-import'),
      require('postcss-mixins')(require('../postcss/mixins/index.js')),
      require('postcss-simple-vars'),
      require('postcss-nested'),
      (require('postcss-functions')(require('../postcss/functions.js')))
    ]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(Locations.client.css.dest));
});


gulp.task('lib-css', function() {
  return gulp.src(Locations.client.css.lib)
    .pipe(concat('lib.css', {
      newLine: FILE_SEPARATOR
    }))
    .pipe(gulp.dest(Locations.client.css.dest));
});


gulp.task('style', ['lib-css', 'css']);
