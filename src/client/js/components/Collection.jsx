'use strict';

const React = require('react');
const { PropTypes } = React;
const Thumbnail = require('./Thumbnail.jsx');

class Collection extends React.Component {
  static className = {
    root: 'sps-collection',
    thumbnailContainer: 'sps-thumbnail-container'
  };


  static propTypes = {
    isFetchingCollection: PropTypes.bool.isRequired,
    collection: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
      type: PropTypes.string.isRequired
    })
  }


  renderEmpty() {
    return 'Select A Collection From the Left by Clicking On It';
  }


  renderThumbnails() {
    const thumbnails = this.props.collection.pictures.map(function (thumbnail) {
      return (
        <Thumbnail
          thumbnail = {thumbnail}
          key = {`thumbnail-${thumbnail.id}`}
        />
      );
    });

    return (
      <div className = {Collection.className.thumbnailContainer}>
        {thumbnails}
      </div>
    );
  }


  renderNonEmpty() {
    return this.renderThumbnails();
  }


  renderLoading() {
    return 'LOADING';
  }


  render() {
    let contents;
    const {
      isFetchingCollection,
      collection
    } = this.props;

    if (isFetchingCollection) {
      contents = this.renderLoading();
    } else if (collection) {
      contents = this.renderNonEmpty();
    } else {
      contents = this.renderEmpty();
    }

    return (
      <div className = {Collection.className.root}>
        {contents}
      </div>
    );
  }
}

module.exports = Collection;
