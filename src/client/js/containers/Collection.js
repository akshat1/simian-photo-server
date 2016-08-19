'use strict';

const { connect } = require('react-redux');
const Collection = require('../components/Collection.jsx');


function mapStateToProps(state) {
  const result = {
    selectedPicture: state.selectedPicture,
    collection: state.selectedCollection,
    isFetchingCollection: state.isFetchingSelectedCollection
  };
  console.log('result is ', result);
  return result;
}


module.exports = connect(mapStateToProps)(Collection);
