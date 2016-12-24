'use strict'; // eslint-disable-line strict

const gulp = require('gulp');
const { client } = require('./locations.js');


function getPostCSSConf() {
  return [
    require('postcss-import'),
    require('postcss-mixins')(require('../postcss/mixins/index.js')),
    require('postcss-simple-vars'),
    require('postcss-nested'),
    (require('postcss-functions')(require('../postcss/functions.js')))
  ];
}


gulp.task('client-css', function() {
  const postCSS = require('gulp-postcss');
  const sourcemaps = require('gulp-sourcemaps');

  return gulp.src(client.css.src)
    .pipe(sourcemaps.init())
    .pipe(postCSS(getPostCSSConf()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(client.css.dest));
});
