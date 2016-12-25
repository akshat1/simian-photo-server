/**
 * @module db
 * @description Provides the db layer for the CRUD module.
 */
import MongoClient from 'mongodb';
import config from '../config';
import getLogger from '../logger';


const logger = getLogger({
  level: config('db.log.level'),
  filePath: 'db.log.path'
});

/**
 * @constant DB
 * @memberof module:DB
*/
const DB = {};


/**
 * Connect to the DB server
 * @returns {Promise}
 * @fulfills {DB}
 * @rejects {Error}
 */
DB.connect = function connect() {
  const url = config('db.url');
  logger.debug(`connecting to db at ${url}`);
  return MongoClient.connect(url)
    .then(function(db) {
      logger.debug('Done connecting to DB');
      return db;
    });
}


/**
 * Bootstrap the DB; Create required collections on the supplied DB (uses create without strict)
 * and return a promise that resolves in the same DB that was supplied as param.
 * @param {DB} - the db to be initialised.
 * @returns {Promise}
 * @fulfills {DB}
 * @rejects {Error}
 */
DB.initialise = function initialise(db) {
  logger.debug('Initialising DB');
  return Promise.all([
      db.createCollection('collections'),
      db.createCollection('pictures')
    ])
    .then(function() {
      logger.debug('Done initialising. Returning DB.');
      return db;
    });
}


/**
 * Connect to DB server, bootstrap the DB and return it.
 * @returns {Promise}
 * @fulfills {DB}
 * @rejects {Error}
 */
DB.getDB = function getDB() {
  logger.debug('getDB()');
  return DB
    .connect()
    .then(DB.initialise());
}

export default DB;
