'use strict'; // eslint-disable-line strict

module.exports = {
  mixins: Object.assign(
    {},
    require('./flexbox.js'),
    require('./position.js'),
    require('./text.js')
  )
};
