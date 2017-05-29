import React from 'react';
import { Link } from 'react-router-dom';

const PictureThumbnail = ({_id, thumbnailPath = ''}) =>
  <div className='sps-picture-thumbnail'>
    <Link to={`/picture/${_id}`}>
      <img src={`/thumbnail/${thumbnailPath.replace('.thumbnails/', '')}`} />
    </Link>
  </div>

export default PictureThumbnail;
