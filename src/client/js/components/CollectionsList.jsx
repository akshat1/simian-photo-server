'use strict';


const React = require('react');

class CollectionsList extends React.Component {
  static className = {
    root: 'sps-collections-list',
    empty: 'sps-collections-list-empty-message'
  };


  renderNoCollections() {
    return (
      <div className = {CollectionsList.className.empty}>
        No Collections
      </div>
    );
  }


  renderCollections() {
    const { collections = [] } = this.props;
    if (collections.length) {
      const items = collections.map(function (c) {
        return (
          <li>
            {c.name}
          </li>
        );
      });
      return <ul>{items}</ul>;
    } else {
      return this.renderNoCollections();
    }
  }


  render() {
    return (
      <div className = {CollectionsList.className.root}>
        {this.renderCollections()}
      </div>
    );
  }
}

module.exports = CollectionsList;
