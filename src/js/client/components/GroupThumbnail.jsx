import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class GroupThumbnail extends React.Component {
  shouldComponentUpdate (nextProps) {
    return this.props._id !== nextProps._id;
  }

  render () {
    const {
      name,
      _id: id
    } = this.props;

    return (
      <div className='sps-group-thumbnail'>
        <Link to={`group/${id}`}>{name}</Link>
      </div>
    );
  }
}

export default GroupThumbnail;
