'use strict';

const gulp = require('gulp');
require('./gfiles/app.js');
require('./gfiles/client.js');


gulp.task('app', ['build-app']);
gulp.task('client', ['build-client']);

gulp.task('build', ['build-app', 'build-client']);
gulp.task('test', ['test-app', 'test-client-js']);
gulp.task('default', ['build'])
