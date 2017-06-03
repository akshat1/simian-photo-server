'use strict'; // eslint-disable-line strict

const gulp = require('gulp');
const gls  = require('gulp-live-server');
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

/*
gulp.task('watch', ['client'], function() {
  gulp.watch(['src/js/client/* * /*.js', 'src/js/client / * * /*.jsx'], ['client']);
});
*/

gulp.task('serve', ['server'], function() {
  const server = gls.new('server/server/index.js');
  server.start();
  const watcher = gulp.watch([
    'src/js/client/**/*.js',
    'src/js/client/**/*.jsx',
    'src/assets/**/*',
    'src/css/**/*.less',
    'src/html/**/*.html'
  ],
  ['client'],
  function() {
    console.log('foo');
  });
  watcher.on('change', function (e) {
    console.log('::: CHANGE :::');
    setTimeout(function() {
      console.log('TIMEOUT');
      server.start.bind(server)();
    }, 3000);
  });

  watcher.on('finish', function () {
    console.log('::: END :::');
  });
});
