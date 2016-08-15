'use strict';

const React = require('react');

class Toolbar extends React.Component {
  static className = {
    root: 'sps-toolbar'
  };

  render() {
    return (
      <div className = {Toolbar.className.root}>
        Toolbar
      </div>
    );
  }
}

module.exports = Toolbar;
