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
  pictures: 'pictures',
  groupContents: 'groupContents' // {groupId, [pictureId]}
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
 * Used by the crud functions to obtain the collection they need. Takes
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
};


/**
 * @param {string} collectionName - NAme of the collection to retrieve records from.
 * @param {Object} query - the query to get records with. As meant for mongodb
 *   `collection.find()`.
 * @param {Object} [opts] - Options.
 * @param {Object} [opts.pagination] - Pagination options. (See Mongo docs for `cursor.skip()`
      and `cursor.limit()`)
 * @param {number} opts.pagination.skip - number of records to skip
 * @param {number} opts.pagination.limit - number of records to return
 * @param {Object} [opts.sort] - Sort options (See Mongo docs for `cursor.sort`)
 * @param {Object} [opts.projection] - Specifies the field to return (See Mongo docs for `collection.find`)
 * @param {boolean} [opts.includeSupplemental=false] - If true return value will include description of
 *    sort, pagination, totals etc.
 * @see https://docs.mongodb.com/manual/reference/method/db.collection.find/
 * @see https://docs.mongodb.com/manual/reference/method/cursor.skip/
 * @see https://docs.mongodb.com/manual/reference/method/cursor.limit/
 * @see https://docs.mongodb.com/manual/reference/method/cursor.sort/
 * @alias getGroups
 * @memberof module:crud
 * @returns {Promise} - A promise that resolves in an array of Group objects
 */
Crud.getItems = async function getItems(collectionName, query = {}, opts = {}) {
  logger.debug('getItems(...)', query);
  const {
    pagination,
    sort,
    projection,
    includeSupplemental
  } = opts;
  const collection = await Crud.getCollection(collectionName);
  const cursor = collection.find(query, projection);
  const totalRecords = await cursor.count();

  if (sort) {
    cursor.sort(sort);
  }

  if (pagination) {
    if (typeof pagination.skip === 'number') {
      cursor.skip(pagination.skip);
    }

    if (typeof pagination.limit === 'number') {
      cursor.limit(pagination.limit);
    }
  }

  if (includeSupplemental) {
    const data = await cursor.toArray()
    const result = {
      data,
      pagination: {
        ...pagination,
        total: totalRecords,
        returned: data.length
      },
      sort: { ...sort }
    };

    return result;
  }

  return cursor.toArray();
};


/**
 * Delete items from the named collection.
 * @param {string} collectionName - name of the collection to delete stuff from
 * @param {Object} query
 * @returns {Promise} - a promise that results in a Mongo write concern
 */
Crud.deleteItems = async function deleteItems(collectionName, query) {
  logger.debug(`deleteItems(${collectionName})`, query);
  if (!query || !Object.keys(query).length) {
    throw new Error('Invalid argument to deleteItems()');
  }
  const collection = await Crud.getCollection(collectionName);
  const {nRemoved} = await collection.remove(query);
  return nRemoved;
}


/**
 * @param {Object} query - the query to get groups with. As meant for mongodb
 *   `collection.find()`.
 * @param {Object} [opts] - Options.
 * @param {Object} [opts.pagination] - Pagination options. Supply Falsie for no pagination.
 * @param {number} opts.pagination.skip - number of records to skip
 * @param {number} opts.pagination.limit - page-size; number of records to return
 * @param {Object} [opts.sort] - Sort options
 * @param {boolean} [opts.includeSupplemental=false] - If true return value will include description of
 *    sort, pagination, totals etc.
 * @see https://docs.mongodb.com/manual/reference/method/cursor.skip/
 * @see https://docs.mongodb.com/manual/reference/method/cursor.limit/
 * @see https://docs.mongodb.com/manual/reference/method/cursor.sort/
 * @alias getGroups
 * @memberof module:crud
 * @returns {Promise} - A promise that resolves in an array of Group objects
 */
Crud.getGroups = function getGroups(query = {}, opts = {}) {
  logger.debug('getGroups', { query });
  return Crud.getItems(Crud.CollectionName.groups, query, opts);
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
Crud.deleteGroups = function deleteGroups(query) {
  logger.debug('deleteGroups(..)', query);
  return Crud.deleteItems(Crud.CollectionName.groups, query);
}


/**
 * @param {Object} query - the query to get pictures with. As meant for mongodb
 *   `collection.find()`.
 * @param {Object} [opts] - Options.
 * @param {Object} [opts.pagination] - Pagination options. Supply Falsie for no pagination.
 * @param {number} opts.pagination.skip - number of records to skip
 * @param {number} opts.pagination.limit - page-size; number of records to return
 * @param {Object} [opts.sort] - Sort options
 * @param {boolean} [opts.includeSupplemental=false] - If true return value will include description of
 *    sort, pagination, totals etc.
 * @see https://docs.mongodb.com/manual/reference/method/cursor.skip/
 * @see https://docs.mongodb.com/manual/reference/method/cursor.limit/
 * @see https://docs.mongodb.com/manual/reference/method/cursor.sort/
 * @alias getGroups
 * @memberof module:crud
 * @returns {Promise} - A promise that resolves in an array of Picture objects
 */
Crud.getPictures = async function getPictures(query, opts) {
  logger.debug('getGroups', { query });
  return Crud.getItems(Crud.CollectionName.pictures, query, opts);
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
Crud.deletePictures = function deletePictures(query) {
  logger.debug('deletePictures(..)', query);
  return Crud.deleteItems(Crud.CollectionName.pictures, query);
}


/**
 * Associate pictures with a group using mongo's _id object-id.
 * @param {string} groupId - group._id (from mongo)
 * @param {string[]} pictureId - array of picture._id (from mongo)
 */
Crud.putPicturesInGroup = async function putPicturesInGroup(groupId, ...pictureIds) {
  logger.debug(`associate(${groupId}, ...)`, pictureIds);
  const collection = await Crud.getCollection(Crud.CollectionName.groupContents);
  const query = { groupId };
  const record = (await collection.find(query).toArray())[0] || {groupId, pictureIds: []};
  const setOfIds = new Set(record.pictureIds);
  pictureIds.forEach((id) => setOfIds.add(id));
  record.pictureIds = Array.from(setOfIds);
  const result = await collection.update(query, record, {upsert: true});
  return result;
}


/**
 * get pictures associated in a group using the _id object-id field set by Mongo
 * @param {string} groupId
 * @returns {Promise} - A promise that resolves into an array of picture ids
 */
Crud.getPicturesInGroup = async function getPicturesInGroup(groupId) {
  logger.debug(`getPicturesInGroup(${groupId})`);
  const collection = await Crud.getCollection(Crud.CollectionName.groupContents);
  const query = { groupId };
  const record = (await collection.find(query).toArray())[0];
  return record ? record.pictureIds : [];
}
