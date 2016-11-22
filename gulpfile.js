'use strict'; // eslint-disable-line strict

const gulp = require('gulp');
require('./gfiles/client.js');
require('./gfiles/crawler.js');
require('./gfiles/server.js');


gulp.task('all', [
  'client',
  'server',
  'crawler'
]);


gulp.task('clean-all', [
  'clean-client', 
  'clean-server', 
  'clean-crawler'
]);


gulp.task('default', [
  'all'
]);


gulp.task('lint', [
  'lint-js'
]);
