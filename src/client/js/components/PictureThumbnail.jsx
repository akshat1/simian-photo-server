'use strict';

const React = require('react');
const { PropTypes } = React;


class PictureThumbnail extends React.Component {
  static className = {
    root: 'sps-picture-thumbnail'
  }

  render() {
    const { picture } = this.props;
    return (
      <div className = {PictureThumbnail.className.root}>
        <img src = {`/thumbnail/${encodeURIComponent(picture.thumbnail)}`}></img>
        {picture.name}
      </div>
    );
  }
}

module.exports = PictureThumbnail;
