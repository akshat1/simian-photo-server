const Crud = require('../../src/js/crud');
const sinon = require('sinon');

const getItems = sinon.stub();
const getGroups = sinon.stub();
const putGroups = sinon.stub();
const getPictures = sinon.stub();
const putPictures = sinon.stub();
const getPicturesInGroup = sinon.stub();

function resetAll() {
  getItems.reset();
  getGroups.reset();
  putGroups.reset();
  getPictures.reset();  
  putPictures.reset();
  getPicturesInGroup.reset();
}

module.exports = {
  GroupType     : JSON.parse(JSON.stringify(Crud.GroupType)),
  CollectionName: JSON.parse(JSON.stringify(Crud.CollectionName)),
  getItems,
  getGroups,
  putGroups,
  getPictures,
  getPicturesInGroup,
  putPictures,
  resetAll
};
