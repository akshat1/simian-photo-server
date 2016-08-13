// TODO: Figure out Mongo projections and stop doing manual picture retrieval for each collection
'use strict';
/**
 * DB module. Provides persistence.
 * @module ./db
 */

const mongoDB = require('promised-mongo');
const config = require('./config.js');
const logger = require('./logger.js')(config('db.log.level'), config('db.log.filePath'));
const hashes = require('node-hashes');
const Path = require('path');
const _ = require('lodash');


const url = 'mongodb://localhost:27017/simianPhotoServer?maxPoolSize=10';
const db = mongoDB(url);
const colCollections = db.collection('collections');
const colPictures = db.collection('pictures');


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


function getCollection(args) {
  logger.debug('getCollection: ', args);
  const queryParams = _.merge({}, args);
  if (queryParams.hasOwnProperty('id'))
    queryParams.id = Number(args.id);
  return colCollections
    .find(queryParams)
    .toArray()
    .then(function (collections) {
      return getPictures({ collections: [collections[0].id] })
        .then(function (pictures) {
          collections[0].pictures = pictures;
          return collections[0];
        });
    });
}


function getCollections() {
  return colCollections
    .find({})
    .toArray()
    .then(function (collections) {
      return Promise.all(collections.map(function (collection) {
        return getPictures({
          collections: [collection.id]
        }).then(function (pictures) {
          collection.pictures = pictures;
          return collection;
        });
      }));
    });
}


function getPictures(args = {}) {
  logger.debug('getPictures', args);
  const query = {};
  if (args.hasOwnProperty('collections'))
    query['collections'] = {
      $in: args.collections
    };
  console.log('query: ', query);
  return colPictures.find(query).toArray();
}


function upsertFile(file) {
  // TODO: Versioned upsert instead of overwrite
  logger.debug('upsertFile', file);
  const filePath = file.path;
  const directory = Path.dirname(filePath);
  return upsertDirectory(directory)
    .then(function (collection) {
      const fileDoc = {
        path: filePath,
        id: hashes.JSHash(filePath),
        collections: collection.id,
        name: Path.basename(filePath),
        rating: 5,
        fullSize: 'foo',
        thumbnail: 'bar'
      };

      return new Promise(function (resolve, reject) {
        colPictures.update({
          id: fileDoc.id
        }, fileDoc, {
          upsert: true
        }, err => {
          if (err)
            reject(err);
          else
            resolve(fileDoc);
        });
      });
    });
}


function upsertDirectory(dirPath) {
  return new Promise(function (resolve, reject) {
    const dirColDoc = {
      type: 'directory',
      id: hashes.JSHash(dirPath),
      path: dirPath,
      name: Path.basename(dirPath),
      pictures: []
    };
    colCollections.update({
      id: dirColDoc.id
    }, dirColDoc, {
      upsert: true
    }, err => {
      if (err)
        reject(err);
      else
        resolve(dirColDoc);
    });
  });
}


module.exports = {
  makePicture,
  makeCollection,
  getPictures,
  getCollection,
  getCollections,
  upsertFile,
  upsertDirectory
};
