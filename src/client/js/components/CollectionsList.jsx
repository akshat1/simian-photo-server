'use strict';


const React = require('react');
const { PropTypes } = React;
//const { connect } = require('react-redux');
const CollectionsListItem = require('../containers/CollectionsListItem.js');

class CollectionsList extends React.Component {
  static className = {
    root: 'sps-collections-list',
    empty: 'sps-collections-list-empty-message'
  };


  static propTypes = {
    isFetchingCollections: PropTypes.bool.isRequired,
    collections: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
      type: PropTypes.string.isRequired
    }).isRequired).isRequired
  };


  renderLoading() {
    return 'LOADING';
  }


  renderNoCollections() {
    return (
      <div className = {CollectionsList.className.empty}>
        No Collections
      </div>
    );
  }


  renderCollections() {
    const {
      isFetchingCollections,
      collections = [],
      onCollectionClick
    } = this.props;

    if (isFetchingCollections) {
      return this.renderLoading();
    } else if (collections.length) {

      const items = collections.map(function (c) {
        return (<CollectionsListItem
          collection = {c}
          key = {`collection-list-item-${c.id}`}
          onClick = {onCollectionClick}
        />);
      });

      return items;
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
