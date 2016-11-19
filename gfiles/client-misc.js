'use strict';

const gulp = require('gulp');
const changed = require('gulp-changed');
const { client } = require('./locations.js');


gulp.task('client-html', function () {
  return gulp.src(client.html.src)
    .pipe(changed(client.html.dest))
    .pipe(gulp.dest(client.html.dest));
});


gulp.task('client-assets', function () {
  return gulp.src(client.assets.src)
    .pipe(changed(client.assets.dest))
    .pipe(gulp.dest(client.assets.dest));
});
