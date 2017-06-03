import React from 'react';
import { connect } from 'react-redux';
import GroupThumbnail from './GroupThumbnail.jsx'
import { fetchCollections } from '../actions';

class GroupList extends React.Component {
  componentWillMount() {
    console.log('COMPONENT WILL MOUNT. YO.');
    this.props.fetchCollections();
  }

  render () {
    const { data=[] } = this.props
    return (<div className='sps-group-list'>
      {data.map((g, i) => <GroupThumbnail key={`gt-${i}`} {...g}/>)}
    </div>);
  }
}

function mapStateToProps({groups}) {
  return {
    ...groups
  }
}

const mapDispatchToProps = {
  fetchCollections
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupList);
