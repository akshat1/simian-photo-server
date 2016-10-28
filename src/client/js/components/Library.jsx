'use strict';

const React = require('react');
const { PropTypes } = React;
const CollectionThumbnail = require('../containers/CollectionThumbnail.js');


class Library extends React.Component {
  static className = {
    root: 'sps-library'
  }

  static propTypes = {
    collections: PropTypes.array.isRequired
  }

  componentWillMount() {
    this.props.loadCollections();
  }

  render() {
    const collectionThumbnails = this.props.collections.map(c =>
      <CollectionThumbnail
        collection = {c}
        key = {c.id}
        />
    );
    return (
      <div className = {Library.className.root}>
        {collectionThumbnails}
      </div>
    );
  }
}


module.exports = Library;
