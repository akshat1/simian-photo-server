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
Crud.connect = function connect() {
  if (!Crud.db) {
    const url = config('db.url');
    logger.debug(`connecting to db at ${url}`);
    return MongoClient
      .connect(url)
      .then(function(db) {
        Crud.db = db;
        return db;
      });
  }

  return Promise.resolve(Crud.db);
};


/**
 * Initialises the crud module if required. Calls connect and creates collections named in the
 * CollectionName enumeration (unless they already exist).
 * @alias initialise
 * @memberof module:crud
 * @return {Promise}
 */
Crud.initialise = function initialise() {
  logger.debug('initialise collections');
  if (Crud.isInitialised) {
    logger.debug('already initialised');
    return Promise.resolve();
  }

  return Crud
    .connect()
    .then(function(db) {
      logger.debug('getting collections');
      for (const key in Crud.CollectionName) {
        const collectionName = Crud.CollectionName[key]
        logger.debug('collectionName: ', collectionName);
        Crud.collections[collectionName] = db.collection(collectionName);
      }
      Crud.isInitialised = true;
    });
};


/**
 * @param {Object} query - the query to get groups with. As meant for mongo db
 *   `collection.find()`.
 * @alias getGroups
 * @memberof module:crud
 * @returns {Promise} - A promise that resolves in an array of Group objects
 */
Crud.getGroups = function getGroups(query = {}) {
  logger.debug('getGroups', { query });
  return Crud
    .initialise()
    .then(function() {
      return Crud
        .collections[Crud.CollectionName.groups]
        .find(query)
        .toArray();
    });
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
Crud.putGroups = function putGroups(groups = []) {
  return Crud
    .initialise()
    .then(function() {
      const collection = Crud.collections[Crud.CollectionName.groups];
      if (!collection) {
        throw new Error(`Missing collection ${Crud.CollectionName.groups}`);
      }
      const promises = groups.map(function(group) {
        return collection.update({
          dirPath: group.dirPath
        }, group, { upsert: true })
      });
      return Promise
        .all(promises)
        .then(() => Promise.resolve(groups));
    });
};


/**
 * Get an array of pictures.
 * @alias getPictures
 * @memberof module:crud
 * @param {Object} query
 * @returns {Promise} - A promise that resolves into an array of Picture objects.
 */
Crud.getPictures = function getPictures(query) {
  logger.debug('getPictures', { query });
  return Crud
    .initialise()
    .then(function() {
      return Crud
        .collections[Crud.CollectionName.pictures]
        .find(query)
        .toArray();
    });
};


/**
 * Store pictures into the DB.
 * @alias putPictures
 * @memberof module:crud
 * @param {Picture} - The pictures to be stored.
 * @returns {Promise} -  a promise that resolves with the same pictures that were stored once they
 *   have been stored.
 */
Crud.putPictures = function putPictures(pictures = []) {
  return Crud
    .initialise()
    .then(function() {
      const collection = Crud.collections[Crud.CollectionName.pictures];
      if (!collection) {
        throw new Error(`Missing collection ${Crud.CollectionName.pictures}`);
      }
      const promises = pictures.map(function(picture) {
        return collection.update({
            filePath: picture.filePath
          }, picture, { upsert: true });
      });
      return Promise
        .all(promises)
        .then(() => Promise.resolve(pictures));
    });
};
