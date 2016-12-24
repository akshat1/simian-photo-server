/**
@module config
@description Exposes itself as a function which itself is a wrapper around nconf.get. Uses command
line, environment, config file and defaults; in this order.
*/
import nconf from 'nconf';
import path from 'path';
import getLogger from '../logger';


const configFilePath = path.join(process.cwd(), 'config.json');
const logDir = path.join(process.cwd(), 'log');
const defaultConfig = {
  'log.level.default': 'debug',
  'log.filePath': path.join(logDir, 'server.log'),
  'webserver.root.path': '/public',
  'webserver.port': 8080,
  'app.thumbnail.path': '/tmp/thumbnails',
  'app.imagePreview.path': '/tmp/preview'
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

// usage: value = config('key')
export default config;
