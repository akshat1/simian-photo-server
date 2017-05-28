'use strict'; // eslint-disable-line strict

const gulp = require('gulp');
const { client } = require('./locations.js');
require('./client-js.js');
require('./client-css.js');
require('./client-misc.js');


gulp.task('client', [
  'client-js',
  'client-css',
  'client-html',
  'client-assets'
]);


gulp.task('watch', function() {
  gulp.watch(['src/js/client/**/*.js', 'src/js/client/**/*.jsx'], ['client']);
});


gulp.task('clean-client', function() {
  const del = require('del');
  return del([client.clean]);
});
