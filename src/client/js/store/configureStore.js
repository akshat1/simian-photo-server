'use strict';

const { createStore, applyMiddleware, compose } = require('redux');
const thunkMiddleware = require('redux-thunk')['default'];
const createLogger = require('redux-logger');
const reducers = require('../reducers');

function configureStore(preloadedState) {
  return createStore(
    reducers,
    preloadedState,
    compose(
      applyMiddleware(thunkMiddleware, createLogger()),
      window.devToolsExtension && window.devToolsExtension()
      )
  );
}

module.exports = configureStore;
