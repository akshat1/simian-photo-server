'use strict';

const { connect } = require('react-redux');
const Library = require('../components/Library.jsx');
const { fetchCollections } = require('../actions');


function mapStateToProps({ collections }) {
  return {
    collections
  };
}


function mapDispatchToProps(dispatch) {
  return {
    loadCollections: () => dispatch(fetchCollections())
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(Library);
