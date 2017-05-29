import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import GroupList from './GroupList.jsx';
import PictureList from './PictureList.jsx';
import Picture from './Picture.jsx';

class Home extends React.Component {
  render () {
    return (
      <div id='spsHome'>
        <Route exact path='/' component={GroupList} />
        <Route exact path='/group/:groupId' component={PictureList} />
        <Route exact path='/picture/:pictureId' component={Picture} />
      </div>
    );
  }
}

export default Home;
