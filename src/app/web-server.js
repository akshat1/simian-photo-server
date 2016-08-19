'use strict';

const config = require('./config.js');
const logger = require('./logger.js')(config('web.log.level'), config('web.log.filePath'));
//const fs = require('fs-extra');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const db = require('./db.js');
//const mime = require('mime');

const app = express();

function promiseToApi(fn) {
  return function (request, response) {
    fn(request.params)
      .then(function (result) {
        console.log('sending response!');
        response.json(result);
      })
      .catch(response.send);
  };
}


function getApiRouter() {
  const api = express.Router();
  api.get('/collections', promiseToApi(db.getCollections));
  api.get('/collections/:id', promiseToApi(db.getCollection));
  api.get('/pictures/:id', promiseToApi(db.getPicture));
  return api;
}


function setUp() {
  logger.debug('setUp');
  // parse json requests
  app.use(bodyParser.json());

  // set up static file serving
  const webRoot = path.join(process.cwd(), config('web.root'));
  logger.info('webRoot: ', webRoot);
  app.use('/', serveStatic(webRoot));
  app.use('/api', getApiRouter());
}


function start() {
  logger.debug('start');
  setUp();
  const listenPort = Number(config('web.port'));
  logger.info('port: ', listenPort);
  app.listen(listenPort, handleServerStart);
}


function handleServerStart() {
  logger.info('web server started');
  logger.info(`listening at ${this.address()}`);
}


module.exports = {
  start
};
