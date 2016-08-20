'use strict';

const React = require('react');
const { PropTypes } = React;


class Picture extends React.Component {
  static className = {
    root: 'sps-picture'
  }


  static propTypes = {
    picture: PropTypes.shape({
      id: PropTypes.number.isRequired,
      collections: PropTypes.arrayOf(PropTypes.number.isRequired),
      name: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
      preview: PropTypes.string.isRequired,
      thumbnail: PropTypes.string.isRequired
    }).isRequired
  };


  renderPreview() {
    const picture = this.props.picture;
    return (
      <img src = {`/preview/${picture.preview}`} />
    );
  }


  render() {
    console.log(this.props);
    return (
      <div className = {Picture.className.root}>
        {this.renderPreview()}
      </div>
    );
  }
}


module.exports = Picture;
