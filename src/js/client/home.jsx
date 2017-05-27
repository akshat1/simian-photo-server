import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

const Home = () =>
  <Provider store={store()}>
    <div id='sps-home'>
      HOME
    </div>
  </Provider>

export default Home;
