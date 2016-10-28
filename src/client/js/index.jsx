'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const { Provider } = require('react-redux');
const { Router, Route, IndexRoute, browserHistory } = require('react-router');
const { syncHistoryWithStore } = require('react-router-redux');
const Collection = require('./containers/Collection.js');
const App = require('./components/App.jsx');
const Library = require('./containers/Library.js');
const configureStore = require('./store/configureStore.js');
const initialState = require('./store/initialState.js');
const actions = require('./actions');


const store = configureStore(initialState);
const history = syncHistoryWithStore(browserHistory, store);


function handleOnCollection({ params }) {
  console.assert(
    typeof params !== 'undefined',
    'handleOnCollection route onEnter handler is missing params object');
  console.assert(
    typeof params.collectionId !== 'undefined',
    'handleOnCollection route onEnter handler is missing params.collectionId');
  console.log(`>>> ${params.collectionId}`);
  actions.selectCollection(params.collectionId);
}


ReactDOM.render(
  <Provider store = {store}>
    <Router history = {history}>
      <Route
        path = '/' component = {App}>
        <IndexRoute component = {Library} />
        <Route
          path = 'collection/:collectionId'
          component = {Collection}
          onEnter = {handleOnCollection}
          />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('spsRoot')
);
