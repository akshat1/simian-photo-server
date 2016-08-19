'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./components/App.jsx');
const { Provider } = require('react-redux');
const configureStore = require('./store/configureStore.js');
const initialState = require('./store/initialState.js');
const actions = require('./actions');


const store = configureStore(initialState);
store.dispatch(actions.fetchCollections());


ReactDOM.render(
  <Provider store = {store}>
    <App />
  </Provider>,
  document.getElementById('spsRoot')
);
