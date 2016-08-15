'use strict';


const React = require('react');

class Collection extends React.Component {
  static className = {
    root: 'sps-collection'
  };

  render() {
    return (
      <div className = {Collection.className.root}>
        Collection Contents & Detail
      </div>
    );
  }
}

module.exports = Collection;
