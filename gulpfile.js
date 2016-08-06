'use strict';

const gulp = require('gulp');
require('./gfiles/app.js');
require('./gfiles/client.js');


gulp.task('build', ['build-app', 'build-client']);
gulp.task('test', ['test-app', 'test-client']);
gulp.task('default', ['build'])
