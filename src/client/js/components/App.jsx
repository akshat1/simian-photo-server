'use strict';

const React = require('react');
const Toolbar = require('./Toolbar.jsx');
const CollectionsList = require('../containers/CollectionsList.js');
const Collection = require('../containers/Collection.js');

class App extends React.Component {
  static className = {
    root: 'sps-app',
    middle: 'sps-mid'
  };


  renderCollections() {
    return (
      <div className = {App.className.middle}>
        <CollectionsList />
        <Collection />
      </div>
    );
  }


  render() {
    return (
      <div className = {App.className.root}>
        <Toolbar />
        {this.renderCollections()}
      </div>
    );
  }
}

module.exports = App;
