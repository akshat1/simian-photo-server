'use strict';
/**
 * Config module. Built around nconf. Accepts arguments via config.json, command line and
 * environment variables and exports a function which will accept a configuration key and
 * return the corresponding value.
 * @module ./config
 *
 */

const nconf = require('nconf');
const path = require('path');

const configFilePath = path.join(process.cwd(), 'config.json');
console.log('Load ', configFilePath);
const logDir = path.join(process.cwd(), 'log');
const defaultConfig = {
  'log.level': 'debug',
  'log.filePath': path.join(logDir, 'sps.log'),
  'web.root': 'client/',
  'web.port': 8080,
  'web.log.level': 'debug',
  'web.log.filePath': path.join(logDir, 'web.log'),
  'db.log.level': 'debug',
  'db.log.filePath': path.join(logDir, 'db.log'),
  'db.location': path.join(process.cwd(), 'db'),
  'crawler.log.level': 'debug',
  'crawler.log.filePath': path.join(logDir, 'crawler.log'),
  'adapters.log.level': 'debug',
  'adapters.log.filePath': path.join(logDir, 'adapters.log'),
  'adapters.thumbnail.location': path.join(process.cwd(), 'image-cache', 'thumbnails'),
  'adapters.preview.location': path.join(process.cwd(), 'image-cache', 'preview'),
  'thumbnail.height': 150,
  'thumbnail.width': 150,
  'preview.height': 600,
  'preview.width': 800,
  directories: []
};

nconf
  .argv()
  .env()
  .file({
    file: configFilePath
  })
  .defaults(defaultConfig);


// Export just the get function
module.exports = nconf.get.bind(nconf);
