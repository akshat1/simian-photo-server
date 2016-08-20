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


function getPicture({ id }) {
  logger.debug('getPicture: ', id);
  const queryParams = {
    id: Number(id)
  };
  console.log(queryParams);

  return colPictures
    .find(queryParams)
    .toArray()
    .then(function (pictures) {
      console.log(pictures);
      return pictures[0];
    });
}


function getCollections() {
  return colCollections
    .find({})
    .toArray();
}


function getPictures(args = {}) {
  logger.debug('getPictures', args);
  const query = {};
  if (args.hasOwnProperty('collections'))
    query['collections'] = {
      $in: args.collections
    };
  return colPictures.find(query).toArray();
}


function upsertFile(file) {
  // TODO: Versioned upsert instead of overwrite
  logger.debug('upsertFile', file);
  const {
    path: filePath,
    thumbnail,
    preview,
    metadata
  } = file;
  const directory = Path.dirname(filePath);
  return upsertDirectory(directory)
    .then(function (collection) {
      const fileDoc = {
        path: filePath,
        id: hashes.JSHash(filePath),
        collections: [collection.id],
        name: Path.basename(filePath),
        rating: 0,
        preview,
        thumbnail,
        metadata
      };

      return colPictures.update({ id: fileDoc.id }, fileDoc, { upsert: true });
    });
}


function upsertDirectory(dirPath) {
  const dirColDoc = {
    type: 'directory',
    id: hashes.JSHash(dirPath),
    path: dirPath,
    name: Path.basename(dirPath)
  };
  return colCollections.update({ id: dirColDoc.id }, dirColDoc, { upsert: true })
    .then(function () {
      return dirColDoc;
    });
}


module.exports = {
  getPicture,
  getPictures,
  getCollection,
  getCollections,
  upsertFile,
  upsertDirectory
};
