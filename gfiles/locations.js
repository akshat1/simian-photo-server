'use strict'; // eslint-disable-line strict

const client = {
  clean: 'public/',

  js: {
    src: ['src/js/**/*.js', 'src/js/**/*.jsx'],
    entry: 'src/js/client/index.js',
    dest: 'public/js/app.js'
  },

  css: {
    src: ['src/css/app.less'],
    dest: 'public/css'
  },

  html: {
    src: 'src/html/**/*.html',
    dest: 'public/'
  },

  assets: {
    src: 'src/assets/**/*',
    dest: 'public/assets/'
  }
};


const server = {
  clean: 'server/',
  src: ['src/js/**/*.js', '!src/js/client/**/*.js', '!src/js/crawler/**/*.js'],
  dest: './server/'
};


const crawler = {
  clean: 'crawler/',
  src: ['src/js/**/*.js', '!src/js/client/**/*.js', '!src/js/server/**/*.js'],
  dest: './crawler/'
};


const test = {
  src: 'test/**/*.js',
  coverage: './coverage/'
};


module.exports = {
  client,
  server,
  crawler,
  test
};
