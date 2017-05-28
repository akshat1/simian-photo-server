import {
  createStore,
  applyMiddleware
  //,compose
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';

//const composeEnhancers = composeWithDevTools({})(thunkMiddleware);

function configureStore() {
  return createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
    // composeEnhancers
    //
  );
}

export default configureStore
