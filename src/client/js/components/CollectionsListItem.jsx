'use strict';


const React = require('react');
const { PropTypes } = React;
//const { connect } = require('react-redux');


class CollectionsListItem extends React.Component {
  static className = {
    root: 'sps-collections-list-item'
  };


  static propTypes = {
    collection: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
      type: PropTypes.string.isRequired
    }).isRequired,

    onClick: PropTypes.func.isRequired
  };


  render() {
    const {
      collection,
      onClick
    } = this.props;

    return (
      <div className={CollectionsListItem.className.root} onClick={onClick}>
        {collection.name}
      </div>
    );
  }
}


module.exports = CollectionsListItem;
