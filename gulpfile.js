'use require';

const gulp = require('gulp');
require('./gfiles/client.js');
require('./gfiles/crawler.js');
require('./gfiles/server.js');
require('./gfiles/quality.js');


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


gulp.task('test', [
  'test-js'
]);
