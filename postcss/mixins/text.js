'use strict';

function textOverflow(mixin, overflowCharacter) {
  return {
    overflow: 'hidden',
    'white-space': 'nowrap',
    'text-overflow': overflowCharacter
  }
}


module.exports = {
  textOverflow
};
