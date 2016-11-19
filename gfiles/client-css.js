'use strict';

const gulp = require('gulp');
const {client} = require('./locations.js');


const FILE_SEPARATOR = '\n\n/* **** **** **** **** **** **** **** **** **** **** **** **** **** */\n\n';


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
  const concat = require('gulp-concat');
  const sourcemaps = require('gulp-sourcemaps');

  return gulp.src(client.css.src)
    .pipe(sourcemaps.init())
    .pipe(postCSS(getPostCSSConf()))
    .pipe(sourcemaps.write('.'))
    pipe(gulp.dest(client.css.dest))
});
