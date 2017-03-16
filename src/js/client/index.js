import React from 'react';
import { render } from 'react-dom';
import { DebugServer } from './components/debug-server/index.jsx'

function startApp() {
  render(<DebugServer />, document.getElementById('spsRoot'));
}

document.addEventListener('DOMContentLoaded', startApp);
