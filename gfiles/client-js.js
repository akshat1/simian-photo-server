'use strict';

const gulp = require('gulp');
const path = require('path');
const { client } = require('./locations.js');


function getWebpackConfig() {
  return {
    devtool: 'inline-source-map',
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }]
    },
    output: {
      filename: path.basename(client.js.dest)
    }
  };
}


gulp.task('client-js', function () {
  const webpack = require('webpack-stream');

  return gulp.src(client.js.entry)
    .pipe(webpack(getWebpackConfig()))
    .pipe(gulp.dest(path.dirname(client.js.dest)));
});
