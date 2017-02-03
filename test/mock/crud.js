const Crud = require('../../src/js/crud');
const sinon = require('sinon');

const getGroups = sinon.stub();
const putGroups = sinon.stub();
const getPictures = sinon.stub();
const putPictures = sinon.stub();

function resetAll() {
  getGroups.reset();
  putGroups.reset();
  getPictures.reset();
  putPictures.reset();
}

module.exports = {
  GroupType     : JSON.parse(JSON.stringify(Crud.GroupType)),
  CollectionName: JSON.parse(JSON.stringify(Crud.CollectionName)),
  getGroups,
  putGroups,
  getPictures,
  putPictures,
  resetAll
};
