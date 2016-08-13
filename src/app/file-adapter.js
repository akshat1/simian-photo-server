'use strict';
/**
@module file-adapter.js
Module where various pluggable adapters are abstracted into a single function call
for the rest of the system.

TODO:
1. Actually have adapters
*/

const Path = require('path');


const VALID_ADAPTERS = [
  '.CR2',
  '.JPG',
  '.JPEG',
  '.PNG'
];


function processFile(path) {
  console.log('fileAdapter.processFile: ', path);
  if (VALID_ADAPTERS.indexOf(Path.extname(path).toUpperCase()) !== -1)
    return Promise.resolve({
      path
    });
  else
    return Promise.resolve();
}


module.exports = {
  processFile
};
