'use strict';

const React = require('react');
const { PropTypes } = React;


class Thumbnail extends React.Component {
  static propTypes = {
    thumbnail: PropTypes.shape({
      thumbnail: PropTypes.string.isRequired,
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
      rating: PropTypes.number.isRequired
    }).isRequired,
    onClick: PropTypes.func.isRequired
  }


  static className = {
    root: 'sps-thumbnail',
    label: 'sps-thumbnail-label'
  };


  renderThumbnail() {
    const thumbnail = this.props.thumbnail;
    return (
      <div className='sps-thumbnail-image'>
        <img src = {`/thumbnail/${thumbnail.thumbnail}`} />
      </div>
    );
  }


  renderLabel() {
    return (
      <div className = {Thumbnail.className.label}>
        {this.props.thumbnail.name}
      </div>
    );
  }


  render() {
    const {
      thumbnail,
      onClick
    } = this.props;

    return (
      <div
        className = {Thumbnail.className.root}
        onClick = {onClick}
        title = {thumbnail.name}
        >
        {this.renderThumbnail()}
        {this.renderLabel()}
      </div>
    );
  }
}


module.exports = Thumbnail;
