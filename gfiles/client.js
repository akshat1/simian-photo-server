'use strict';

const gulp = require('gulp');
require('./client-js.js');
require('./client-css.js');
const changed = require('gulp-changed');
const Locations = require('./locations.js');


gulp.task('resources', function() {
  return gulp.src(Locations.resources.src)
    .pipe(changed(Locations.resources.dest))
    .pipe(gulp.dest(Locations.resources.dest));
});


gulp.task('html', function() {
  return gulp.src(Locations.html.src)
    .pipe(changed(Locations.html.dest))
    .pipe(gulp.dest(Locations.html.dest));
});
