'use strict';

const React = require('react');
const { PropTypes } = React;
const PictureThumbnail = require('./PictureThumbnail.jsx');


class Collection extends React.Component {
  static className = {
    root: 'sps-collection'
  }


  renderPictures() {
    return this.props.collection.pictures.map((picture, index) =>
      <PictureThumbnail picture = {picture} key = {index}/>
    );
  }


  render() {
    return (
      <div className = {Collection.className.root}>
        {this.renderPictures()}
      </div>
    );
  }
}


Collection.propTypes = {
  collection: PropTypes.object.isRequired
};


module.exports = Collection;
