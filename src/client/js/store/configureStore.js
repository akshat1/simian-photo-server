'use strict';

const { createStore, applyMiddleware } = require('redux');
const thunkMiddleware = require('redux-thunk')['default'];
const createLogger = require('redux-logger');
const reducers = require('../reducers');

function configureStore(preloadedState) {
  return createStore(
    reducers,
    preloadedState,
    applyMiddleware(thunkMiddleware, createLogger())
  );
}

module.exports = configureStore;
