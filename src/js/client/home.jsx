import React from 'react';
import { connect } from 'react-redux';
import { fetchCollections } from './actions';

class Home extends React.Component {
  componentWillMount() {
    console.log('COMPONENT WILL MOUNT. YO.');
    this.props.fetchCollections();
  }

  render () {
    return (
      <div id='sps-home'>
        HOME
      </div>
    );
  }
}

const mapStateToProps = () => ({})
const mapDispatchToProps = {
  fetchCollections
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
