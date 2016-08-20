'use strict';

const React = require('react');
const { PropTypes } = React;
const Thumbnail = require('../containers/Thumbnail.js');
const Picture = require('./Picture.jsx');

class Collection extends React.Component {
  static className = {
    root: 'sps-collection',
    thumbnailContainer: (hasSelection => `sps-thumbnail-container ${hasSelection ? 'mini' : ''}`),
    pictureContainer: 'sps-picture-container'
  };


  static propTypes = {
    isFetchingCollection: PropTypes.bool.isRequired,
    collection: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
      type: PropTypes.string.isRequired
    }),
    selectedPicture: PropTypes.shape({
      id: PropTypes.number.isRequired,
      collections: PropTypes.arrayOf(PropTypes.number.isRequired),
      name: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      preview: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired,
      metadata: PropTypes.object
    })
  }


  renderEmpty() {
    return 'Select A Collection From the Left by Clicking On It';
  }


  renderSelectedPicture() {
    const { selectedPicture } = this.props;
    if (selectedPicture) {
      return (
        <div
          className = {Collection.className.pictureContainer}
          key = 'sps-picture-container'
          >
          <Picture picture = {selectedPicture}/>
        </div>
      );
    }
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
      <div
        className = {Collection.className.thumbnailContainer(!!this.props.selectedPicture)}
        key = 'sps-thumbnail-container'
        >
        {thumbnails}
      </div>
    );
  }


  renderNonEmpty() {
    return [
      this.renderSelectedPicture(),
      this.renderThumbnails()
    ];
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
