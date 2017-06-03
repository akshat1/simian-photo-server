import React from 'react';
import path from 'path';
import {
  Route
} from 'react-router-dom';
import {connect} from 'react-redux';
import Bar from './Bar.jsx';

const HomeView = () => <span>Picture Groups</span>

const GroupView = connect((({activeGroup={}}) => ({...activeGroup})), {})(({name}) => <span>{name}</span>)

const PictureView = connect(({picture={}}) => ({...picture}), {})(({filePath}) => <span>{path.basename(filePath)}</span>)

class AppNav extends React.Component {
  render () {
    return (
      <Bar>
        <Route exact path='/' component={HomeView} />
        <Route exact path='/group/:groupId' component={GroupView} />
        <Route exact path='/picture/:pictureId' component={PictureView} />
      </Bar>
    );
  }
}

export default AppNav;
