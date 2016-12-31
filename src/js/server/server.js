import config from '../config';
import getLogger from '../logger';
import path from 'path';
import fs from 'fs-extra';
import express from 'express';
import bodyParser from 'body-parser';
import serveStatic from 'serve-static';


const logger = getLogger({
  level: config('webserver.log.level'),
  filePath: 'webserver.log.path'
});

/**
 * @constant Server
 * @memberof module:server
 * @description The webserver.
 */
const Server = {};


/**
 * @memberof module:server
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
 * @description Handle server start event. Empty for now.
 */
Server.handleServerStart = function() {
  logger.debug('handleServerStart');
  logger.info(`web server started listening at ${this.address()}`);
};


export default Server;
