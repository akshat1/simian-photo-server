'use strict';

const { connect } = require('react-redux');
const CollectionThumbnail = require('../components/CollectionThumbnail.jsx');
const { navigateToCollection } = require('../actions');


function mapStateToProps() {
  return {};
}


const mapDispatchToProps = {
  onClick: navigateToCollection
};


module.exports = connect(mapStateToProps, mapDispatchToProps)(CollectionThumbnail);
