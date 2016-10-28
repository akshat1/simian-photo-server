'use strict';

const React = require('react');
const PropTypes = React.PropTypes;

const CollectionThumbnail = ({ collection, onClick }) =>
  (
    <div className = 'sps-collection-thumbnail' onClick = {() => onClick(collection.id)}>
      {collection.name}
    </div>
  );

CollectionThumbnail.propTypes = {
  collection: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};


module.exports = CollectionThumbnail;
