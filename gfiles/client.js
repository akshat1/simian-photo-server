'use strict';

const gulp = require('gulp');
require('./client-js.js');
require('./client-css.js');
const changed = require('gulp-changed');
const Locations = require('./locations.js');


gulp.task('resources', function() {
  return gulp.src(Locations.client.resources.src)
    .pipe(changed(Locations.client.resources.dest))
    .pipe(gulp.dest(Locations.client.resources.dest));
});


gulp.task('html', function() {
  return gulp.src(Locations.client.html.src)
    .pipe(changed(Locations.client.html.dest))
    .pipe(gulp.dest(Locations.client.html.dest));
});


gulp.task('build-client', ['build-client-js', 'html', 'resources', 'style']);
