import React from 'react';
import Thumbnail from './Thumbnail.jsx'
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

    return <Thumbnail label={name} linkTarget={`group/${id}`}/>;
  }
}

export default GroupThumbnail;
