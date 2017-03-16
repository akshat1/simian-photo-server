const React = require('react');

const JSONViewer = (value) =>
  <div className = 'json-viewer'>
    <pre>
      {JSON.stringify(value, null, 2)}
    </pre>
  </div>

module.exports = { JSONViewer }
