/**
@module config
@description Exposes itself as a function which itself is a wrapper around nconf.get. Uses command
line, environment, config file and defaults; in this order.
*/
const nconf = require('nconf');
const path = require('path');
const { getLogger } = require('../logger');


const configFilePath = path.join(process.cwd(), 'config.json');
const logDir = path.join(process.cwd(), 'log');
const defaultConfig = {
  'log.level.default'             : 'debug',
  'webserver.root.path'           : '/public',
  'webserver.port'                : 8080,
  'webserver.log.level'           : 'debug',
  'webserver.log.path'            : path.join(logDir, 'server.log'),
  'app.thumbnail.path'            : '/tmp/thumbnails',
  'app.imagePreview.path'         : '/tmp/preview',
  'db.url'                        : 'mongodb://localhost:27017/simianPhotoServer',
  'db.log.level'                  : 'debug',
  'db.log.path'                   : path.join(logDir, 'db.log'),
  'crud.log.level'                : 'debug',
  'crud.log.path'                 : path.join(logDir, 'crud.log'),
  'crawler.log.level'             : 'debug',
  'crawler.log.path'              : path.join(logDir, 'crawler.log'),
  'system.fs.directories'         : ['/home/xu0/photos'],
  'system.thumbnailDirPath'       : '.thumbnails',
  'system.previewDirPath'         : '.preview',
  'system.image.thumbnail.height' : 150,
  'system.image.thumbnail.width'  : 150,
  'system.image.preview.width'    : 800,
  'system.image.preview.height'   : 600,
  'image.log.level'               : 'debug',
  'image.log.path'                : path.join(logDir, 'image.log')
};


/*
Set up nconf
*/
nconf
  .argv()
  .env()
  .file({
    file: configFilePath
  })
  .defaults(defaultConfig);


const logger = getLogger({
  level: 'debug',
  filePath: path.join(process.cwd(), nconf.get('logger.log.filePath') || 'logger.log')
});

/**
@param {String} key
@returns {Object|Number|String} value
*/
function config(key) {
  const result = nconf.get(key);
  if (typeof result === 'undefined')
    logger.warn(`no config value found for key: ${key}`);
  return result;
}

module.exports = { config };
