import React from 'react';
import { connect } from 'react-redux';
import { fetchPicture } from '../actions';
import Spinner from './Spinner.jsx';

class Picture extends React.Component {
  componentWillMount() {
    const pictureId = this.props.match && this.props.match.params.pictureId
    if (pictureId) {
      this.props.fetchPicture(pictureId);
    }
  }

  renderContents() {
    const {
      picture,
      isFetchingPicture
    } = this.props

    if(isFetchingPicture)
      return <Spinner />;

    if (picture.previewPath)
      return <img src={`/preview/${picture.previewPath.replace('.preview/', '')}`} />;

    return false;
  }

  render() {
    return (
      <div className='sps-picture'>
        {this.renderContents()}
      </div>
    );
  }
}

function mapStateToProps({picture, isFetchingPicture}) {
  return {
    picture,
    isFetchingPicture
  };
}

const mapDispatchToProps = {
  fetchPicture
};

export default connect(mapStateToProps, mapDispatchToProps)(Picture);
