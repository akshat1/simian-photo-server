import React from 'react';
import { Route } from 'react-router-dom';
import AppNav from './AppNav.jsx';
import GroupList from './GroupList.jsx';
import PictureList from './PictureList.jsx';
import Picture from './Picture.jsx';

class Home extends React.Component {
  render () {
    return (
      <div id='spsHome'>
        <AppNav />
        <Route exact path='/' component={GroupList} />
        <Route exact path='/group/:groupId' component={PictureList} />
        <Route exact path='/picture/:pictureId' component={Picture} />
      </div>
    );
  }
}

export default Home;
