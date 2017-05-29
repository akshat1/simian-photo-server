import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import Home from './components/Home.jsx'

function startApp() {
  render(
    (<Provider store={store()}>
      <BrowserRouter basename='/app'>
        <Home />
      </BrowserRouter>
    </Provider>),
    document.getElementById('spsRoot')
  );
}

document.addEventListener('DOMContentLoaded', startApp);
