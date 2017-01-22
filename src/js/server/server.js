const { config } = require('../config');
const { getLogger } = require('../logger');
const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');


const logger = getLogger({
  level: config('webserver.log.level'),
  filePath: 'webserver.log.path'
});


const Server = module.exports = {};


/**
 * @memberof module:server
 * @alias setUpStaticServer
 * @param {App} app
 * @returns {App} - the same app instance that was supplied as argument
 */
Server.setUpStaticServer = function(app) {
  logger.debug('setUpStaticServer');
  const webRootPath = path.join(process.cwd(), config('webserver.root.path'));
  const thumbnailDirPath = path.join(process.cwd(), config('app.thumbnail.path'));
  const imagePreviewPath = path.join(process.cwd(), config('app.imagePreview.path'));
  logger.debug(`webRootPath: ${webRootPath}`);
  logger.debug(`thumbnailDirPath: ${thumbnailDirPath}`);
  logger.debug(`imagePreviewPath: ${imagePreviewPath}`);
  fs.ensureDirSync(webRootPath);
  fs.ensureDirSync(thumbnailDirPath);
  fs.ensureDirSync(imagePreviewPath);
  app.use('/', serveStatic(webRootPath));
  app.use('/thumbnail', serveStatic(thumbnailDirPath));
  app.use('/preview', serveStatic(imagePreviewPath));
  return app;
};


/**
 * @memberof module:server
 * @alias startWebServer
 * @description Starts the entire web-server
 */
Server.startWebServer = function() {
  logger.debug('startWebServer');
  const app = express();
  app.use(bodyParser.json());
  Server.setUpStaticServer(app);
  const listenPort = Number(config('webserver.port'));
  app.listen(listenPort, Server.handleServerStart);
  logger.info(`Listening at port: ${listenPort}`);
  logger.debug('done');
};


/**
 * @memberof module:server
 * @alias handleServerStart
 * @description Handle server start event. Empty for now.
 */
Server.handleServerStart = function() {
  logger.debug('handleServerStart');
  logger.info(`web server started listening at ${this.address()}`);
};


module.exports = Server;
