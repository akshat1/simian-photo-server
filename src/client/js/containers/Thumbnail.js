'use strict';

const { connect } = require('react-redux');
const Thumbnail = require('../components/Thumbnail.jsx');


function mapStateToProps(state) {
  return {
    thumbnail: state.thumbnail
  };
}


module.exports = connect(mapStateToProps)(Thumbnail);
