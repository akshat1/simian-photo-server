'use strict';

const { connect } = require('react-redux');
const Collection = require('../components/Collection.jsx');


function mapStateToProps(state) {
  return {
    collection: state.selectedCollection
  };
}

module.exports = connect(mapStateToProps)(Collection);
