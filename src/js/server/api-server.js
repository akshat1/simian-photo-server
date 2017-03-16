const { config } = require('../config');
const { getLogger } = require('../logger');
const Crud = require('../crud');
const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const logger = getLogger({
  level: config('webserver.log.level'),
  filePath: config('webserver.log.path')
});


const ApiServer = module.exports = {
  /**
   * Recursively searches the query to convert all string values stored with the key "_id" to
   * instances of MongoDB.ObjectID.
   * @param {Object} qre
   * @returns {Object}
   */
  massageQuery: function massageQuery(qre) {
    const out = { ...qre };
    for (let key in out) {
      const val = qre[key];
      if (typeof val === 'string') {
        out[key] = ObjectID(val);
      } else if (typeof val === 'object') {
        out[key] = ApiServer.massageQuery(val);
      }
    }
    return out;
  },

  /**
   * @param {Request} request
   * @param {Response} response
   * @param {Promise} p
   */
  sendResponse: function sendResponse(response, p) {
    return p
      .then(function (data) {
        response.json(data);
      })
      .catch(function (error) {
        logger.error(error);        
        const x = response.status(error.status || 500);
        x.json({
          stack: error.stack,
          message: error.message
        });
      });
  },


  getItems: async function getItems (collectionName, request, response) {
    logger.debug('ApiServer.getItems - ', collectionName);
    try {
      const {
        search = {},
        pagination,
        sort,
        projection
      } = request.body;

      response.json(
        await Crud.getItems(
          collectionName,
          ApiServer.massageQuery(search),
          {
            pagination,
            sort,
            projection,
            includeSupplemental: true
          }
        )
      );
    } catch (err) {
      logger.error(err);
      response.status(500).send({err});
    }
  },


  /* istanbul ignore next: just uses getItems */
  getGroups: function getGroups(request, response) {
    logger.info('ApiServer.getGroups - ', request.query);
    return ApiServer.getItems(Crud.CollectionName.groups, request, response);
  },


  /* istanbul ignore next: just uses getItems */
  getPictures: function getPictures(request, response) {
    logger.info('ApiServer.getPictures - ', request.query);
    return ApiServer.getItems(Crud.CollectionName.pictures, request, response);
  },


  getPicturesInGroup: async function getPicturesInGroup(request, response) {
    logger.debug('getPicturesInGroup');
    const groupId = request.body.groupId;
    if (typeof request.body.groupId === 'undefined') {
      const err = new Error('Missing required param groupId');
      err.status = 428;
      return ApiServer.sendResponse(response, Promise.reject(err));
    }

    const pictureIds = await Crud.getPicturesInGroup(groupId);
    const pictureObjectIds = pictureIds.map(x => ObjectID(x));
    const promise = Crud.getPictures({
      '_id': {
        '$in': pictureObjectIds
      }
    });
    return ApiServer.sendResponse(response, promise);
  },


  setUpGroups: function setUpGroups(router) {
    router.use('/groups', ApiServer.getGroups);
    router.use('/group-contents', ApiServer.getPicturesInGroup);
  },


  setUpPictures: function setUpPictures(router) {
    router.use('/pictures', ApiServer.getPictures);
  },


  /**
  * @memberof module:server
  * @alias setUpRestApi
  * @param {App} app - Exress server app; The result of express()
  * @returns {App} - the same app instance that was supplied as argument
  */
  setUpRestApi: function setUpRestApi(app) {
    logger.debug('setUpRestApi');
    const api = express.Router();
    ApiServer.setUpGroups(api);
    ApiServer.setUpPictures(api);

    app.use(bodyParser.json());
    app.use('/api', api);
    return app;
  }
};
