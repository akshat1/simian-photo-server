'use strict';

function textOverflow(mixin, overflowCharacter) {
  return {
    overflow: 'hidden',
    'white-space': 'nowrap',
    'text-overflow': overflowCharacter || 'ellipsis'
  }
}


module.exports = {
  textOverflow
};
