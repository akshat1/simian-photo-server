import React from 'react';
import Thumbnail from './Thumbnail.jsx';

const PictureThumbnail = ({_id, thumbnailPath = ''}) =>
  <Thumbnail linkTarget={`/picture/${_id}`}>
    <img src={`/thumbnail/${thumbnailPath.replace('.thumbnails/', '')}`} />
  </Thumbnail>

export default PictureThumbnail;
