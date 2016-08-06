'use strict';

const Locations = {
  app: {
    src: 'src/app/**/*.js',
    dest: 'app/',
    coverage: 'coverage/app',
    test: 'test/app/**/*.js'
  },

  client: {
    js: {
      src: 'src/client/js/**/*.js',
      dest: 'client/js',
      coverage: 'coverage/client',
      test: 'test/client/**/*.js'
    },

    css: {
      src: 'src/client/css/**/*.css',
      lib: 'src/client/lib/**/*.css',
      dest: 'client/css'
    },

    html: {
      src: 'src/client/html/**/*.html',
      dest: 'client/html'
    },
    resources: {
      src: 'src/client/resources/**/*',
      dest: 'client/resources'
    }
  }
};


module.exports = Locations;
