'use strict';

const React = require('react');
const { PropTypes } = React;
const SplitPane = require('./SplitPane.jsx');
const _ = require('lodash');


class Picture extends React.Component {
  static className = {
    root: 'sps-picture',
    metadata: 'sps-picture-metadata',
    splitPane: 'sps-picture-split-pane'
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


  renderMetadata() {
    const rows = _.map(this.props.picture.metadata, function (value, key) {
      return (
        <tr key={key}>
          <td>{key}</td>
          <td>{value}</td>
        </tr>
      );
    });
    return (
      <div className={Picture.className.metadata}>
        <table>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }


  render() {
    console.log(this.props);
    return (
      <div className = {Picture.className.root}>
        <SplitPane direction = 'horizontal' className = {Picture.className.splitPane}>
          {this.renderPreview()}
          {this.renderMetadata()}
        </SplitPane>
      </div>
    );
  }
}


module.exports = Picture;
