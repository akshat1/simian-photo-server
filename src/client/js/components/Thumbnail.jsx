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
    root: 'sps-thumbnail'
  };


  render() {
    const {
      thumbnail,
      onClick
    } = this.props;

    return (
      <div
        className = {Thumbnail.className.root}
        onClick = {onClick}>
        {thumbnail.name}
      </div>
    );
  }
}


module.exports = Thumbnail;
