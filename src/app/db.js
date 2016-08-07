'use strict';

/* Dummy Stuff */
function makePicture() {
  const stub = String(Date.now()).substr(-4);
  return {
    id: stub,
    name: `Pic-${stub}`,
    rating: Math.ceil(Math.random() * 5),
    fullSize: `fs-${stub}`,
    thumbnail: `tn-${stub}`
  };
}


function makeCollection() {
  const stub = String(Date.now()).substr(-4);
  const numPictures = Math.ceil(10 * Math.random());
  const pictures = [];
  for (let i = 0; i < numPictures; i++)
    pictures.push(makePicture());

  return {
    id: stub,
    name: `Col-${stub}`,
    pictures
  };
}


function getCollection(...params) {
  console.log('getCollection: ', params);
  return makeCollection();
}


function getCollections() {
  const res = [];
  for (let i = 0; i < 10; i++)
    res.push(makeCollection());
  return res;
}


module.exports = {
  makePicture,
  makeCollection,
  getCollection,
  getCollections
};
