'use strict';

function position(mixin, position, top, right, bottom, left) {
  return {
    position: position,
    top: top,
    right: right,
    bottom: bottom,
    left: left
  };
}


module.exports = {
  position: position
};
