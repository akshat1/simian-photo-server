import React from 'react';
import { render } from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Home from './home.jsx'

function startApp() {
  render(
    (<Provider store={store()}>
      <Home />
    </Provider>),
    document.getElementById('spsRoot')
  );
}

document.addEventListener('DOMContentLoaded', startApp);
