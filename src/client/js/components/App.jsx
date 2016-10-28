'use strict';

const React = require('react');
const Toolbar = require('./Toolbar.jsx');

class App extends React.Component {
  static className = {
    root: 'sps-app',
    header: 'sps-app-header',
    body: 'sps-app-body',
    footer: 'sps-app-footer'
  };


  renderHeader() {
    return (
      <div className = {App.className.header}>
        <Toolbar />
      </div>
    );
  }


  renderBody() {
    return (
      <div className = {App.className.body}>
        {this.props.children || 'HELLO'}
      </div>
    );
  }


  renderFooter() {
    return (
      <div className = {App.className.footer}>
        FOOTER
      </div>
    );
  }


  render() {
    return (
      <div className = {App.className.root}>
        {this.renderHeader()}
        {this.renderBody()}
        {this.renderFooter()}
      </div>
    );
  }
}

module.exports = App;
