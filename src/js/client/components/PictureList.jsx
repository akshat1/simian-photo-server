import React from 'react';
import { connect } from 'react-redux';
import { setActiveGroup } from '../actions';
import PictureThumbnail from './PictureThumbnail.jsx';

class PictureList extends React.Component {
  componentWillMount() {
    console.log('bloop');
    const {groupId} = this.props.match && this.props.match.params
    if (groupId) {
      this.props.setActiveGroup(groupId);
    } else {
      console.error('No groupId');
    }
  }

  render () {
    return (
      <div className='sps-picture-list'>
        {this.props.pictures.map((p, i) => <PictureThumbnail key={`p-thumb-${i}`} {...p}/>)}
      </div>
    );
  }
}

function mapStateToProps({pictures}) {
  return {
    pictures
  }
}

const mapDispatchToProps = {
  setActiveGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(PictureList);
