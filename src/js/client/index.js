import React from 'react';
import { render } from 'react-dom';
import Home from './home.jsx'

function startApp() {
  render(<Home />, document.getElementById('spsRoot'));
}

document.addEventListener('DOMContentLoaded', startApp);
