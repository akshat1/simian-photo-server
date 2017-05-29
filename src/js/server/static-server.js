const { config } = require('../config');
const { getLogger } = require('../logger');
const path = require('path');
const fs = require('fs-extra');
const serveStatic = require('serve-static');


const logger = getLogger({
  level: config('webserver.log.level'),
  filePath: config('webserver.log.path')
});


/**
 * @memberof module:server
 * @alias setUpStaticServer
 * @param {App} app - Exress server app; The result of express()
 * @returns {App} - the same app instance that was supplied as argument
 */
module.exports.setUpStaticServer = function setUpStaticServer(app) {
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
  app.use('/app', serveStatic(webRootPath));
  app.use('/thumbnail', serveStatic(thumbnailDirPath));
  app.use('/preview', serveStatic(imagePreviewPath));
  return app;
};
