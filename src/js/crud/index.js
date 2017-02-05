/**
 * @module crud
 * @description What the name says.
 */
const { MongoClient } = require('mongodb');
const { config } = require('../config');
const { getLogger } = require('../logger');


const logger = getLogger({
  level: config('crud.log.level'),
  filePath: config('crud.log.path')
});


/**
 * Enum for group types.
 * @memberof module:model
 */
const GroupType = {
  directory: 1
};


/**
 * @typedef {Object} Picture
 * @memberof module:crud
 * @property {string} filePath
 * @property {string} thumbnailName
 * @property {string} previewName
 * @property {number} rating
 * @property {Object} metadata
 */


const Crud = module.exports = {
  GroupType: GroupType,
  isInitialised: false,
  db: null,
  collections: {},
};


/**
 * @alias CollectionName
 * @enum {String}
 * @memberof module:crud
 * @description an enumeration of collection names.
 */
Crud.CollectionName = {
  groups: 'groups',
  pictures: 'pictures'
};


/**
 * Connects to the mongodb server and gets a db instance.
 * @alias connect
 * @memberof module:crud
 * @returns {Promise}
 */
Crud.connect = async function connect() {
  if (!Crud.db) {
    const url = config('db.url');
    logger.debug(`connecting to db at ${url}`);
    const db = await MongoClient.connect(url);
    Crud.db = db;
    return db;
  }

  return Crud.db;
};


/**
 * Initialises the crud module if required. Calls connect and creates collections named in the
 * CollectionName enumeration (unless they already exist).
 * @alias initialise
 * @memberof module:crud
 * @return {Promise}
 */
Crud.initialise = async function initialise() {
  logger.debug('initialise collections');
  if (Crud.isInitialised) {
    logger.debug('already initialised');
    return;
  }

  const db = await Crud.connect();
  logger.debug('getting collections');
  for (const key in Crud.CollectionName) {
    const collectionName = Crud.CollectionName[key]
    logger.debug('collectionName: ', collectionName);
    Crud.collections[collectionName] = db.collection(collectionName);
  }

  Crud.isInitialised = true;
};


/**
 * Used by he crud functions to obtain the collection they need. Takes
 * care of initializing the module and throwing errors for missing
 * collections. Makes code more streamlined.
 * @alias getCollection
 * @memberof module:crud
 * @param {string} collectionName - The collection desired
 * @returns {Promise} - A promise that resolves in a MongoDB collection
 */
Crud.getCollection = async function getCollection(collectionName) {
  logger.debug(`getCollection(${collectionName})`)
  if (typeof collectionName !== 'string') {
    throw new Error('Invalid argument to getCollection. Expected string.');
  }

  await Crud.initialise();
  const collection = Crud.collections[collectionName];
  if (!collection) {
    throw new Error(`Missing collection ${collectionName}`);
  }

  return collection;
}


/**
 * @param {Object} query - the query to get groups with. As meant for mongo db
 *   `collection.find()`.
 * @alias getGroups
 * @memberof module:crud
 * @returns {Promise} - A promise that resolves in an array of Group objects
 */
Crud.getGroups = async function getGroups(query = {}) {
  logger.debug('getGroups', { query });
  const collection = await Crud.getCollection(Crud.CollectionName.groups);
  return collection.find(query).toArray();
};


/**
 * Store groups into the DB. Will replace existing groups if found with matching ids.
 * // TODO: We should implement a strict PUT (with 409s) and DELETE
 * @alias putGroups
 * @memberof module:crud
 * @param {Group[]} groups - the groups to be stored.
 * @returns {Promise} -  a promise that resolves with the same groups that were stored once they
 *   have been stored.
 */
Crud.putGroups = async function putGroups(groups = []) {
  const collection = await Crud.getCollection(Crud.CollectionName.groups);
  const promises = groups.map(function(group) {
    return collection.update({
      dirPath: group.dirPath
    }, group, { upsert: true })
  });

  await Promise.all(promises);
  return groups;
};


/**
 * Delete groups that match the provided query.
 * @param {Object} query - Mongodb query
 * @returns {Promise} - resolves into the number of groups deleted
 */
Crud.deleteGroups = async function deleteGroups(query) {
  logger.debug('deleteGroups(..)', query);
  if (!query || !Object.keys(query).length) {
    throw new Error('Invalid argument to deleteGroups()');
  }
  const collection = await Crud.getCollection(Crud.CollectionName.groups);
  const {nRemoved} = await collection.remove(query);
  return nRemoved;
}


/**
 * Get an array of pictures.
 * @alias getPictures
 * @memberof module:crud
 * @param {Object} query
 * @returns {Promise} - A promise that resolves into an array of Picture objects.
 */
Crud.getPictures = async function getPictures(query) {
  logger.debug('getPictures', { query });
  const collection = await Crud.getCollection(Crud.CollectionName.pictures);
  return collection.find(query).toArray();
};


/**
 * Store pictures into the DB.
 * @alias putPictures
 * @memberof module:crud
 * @param {Picture} - The pictures to be stored.
 * @returns {Promise} -  a promise that resolves with the same pictures that were stored once they
 *   have been stored.
 */
Crud.putPictures = async function putPictures(pictures = []) {
  const collection = await Crud.getCollection(Crud.CollectionName.pictures);
  const promises = pictures.map(function(picture) {
    return collection.update({
        filePath: picture.filePath
      }, picture, { upsert: true });
  });

  await Promise.all(promises);
  return pictures;
};


/**
 * Delete pictures that match the provided query.
 * @param {Object} query - Mongodb query
 * @returns {Promise} - resolves into the number of pictures deleted
 */
Crud.deletePictures = async function deletePictures(query) {
  logger.debug('deletePictures(..)', query);
  if (!query || !Object.keys(query).length) {
    throw new Error('Invalid argument to deletePictures()');
  }
  const collection = await Crud.getCollection(Crud.CollectionName.pictures);
  const {nRemoved} = await collection.remove(query);
  return nRemoved;
}
