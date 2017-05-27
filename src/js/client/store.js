import {
  createStore,
  applyMiddleware
  //,compose
} from 'redux';
import promiseMiddleware from 'redux-promise';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';

const composeEnhancers = composeWithDevTools({});

function configureStore() {
  return createStore(
    reducer,
    composeEnhancers(
      applyMiddleware(promiseMiddleware)
    )
  );
}

export default configureStore
