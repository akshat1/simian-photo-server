'use strict';

const { connect } = require('react-redux');
const CollectionsListItem = require('../components/CollectionsListItem.jsx');
const { selectCollection } = require('../actions');


function mapStateToProps() {
  return {};
}


function mapDispatchToProps(dispatch, ownProps) {
  return {
    onClick: () => dispatch(selectCollection(ownProps.collection.id))
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(CollectionsListItem);
