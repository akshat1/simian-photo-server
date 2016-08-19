'use strict';

const { connect } = require('react-redux');
const CollectionsList = require('../components/CollectionsList.jsx');


function mapStateToProps(state) {
  return {
    isFetchingCollections: state.isFetchingCollections,
    collections: state.collections
  };
}


module.exports = connect(mapStateToProps)(CollectionsList);
