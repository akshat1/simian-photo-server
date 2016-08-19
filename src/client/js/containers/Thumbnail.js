'use strict';

const { connect } = require('react-redux');
const Thumbnail = require('../components/Thumbnail.jsx');
const { selectPicture } = require('../actions');


function mapStateToProps() {
  return {};
}


function mapDispatchToProps(dispatch, ownProps) {
  return {
    onClick: () => dispatch(selectPicture(ownProps.thumbnail.id))
  };
}


module.exports = connect(mapStateToProps, mapDispatchToProps)(Thumbnail);
