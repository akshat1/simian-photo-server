import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import store from './store';
import Home from './components/Home.jsx'

function startApp() {
  render(
    (<Provider store={store()}>
      <HashRouter basename='/'>
        <Home />
      </HashRouter>
    </Provider>),
    document.getElementById('spsRoot')
  );
}

document.addEventListener('DOMContentLoaded', startApp);
