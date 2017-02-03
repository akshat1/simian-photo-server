const sinon = require('sinon');

const isImageFile = sinon.stub();
const resize      = sinon.stub();
const getExif     = sinon.stub();

function resetAll() {
  isImageFile.reset();
  resize.reset();
  getExif.reset();
}

module.exports = {
  isImageFile,
  resize,
  getExif,
  resetAll
};
