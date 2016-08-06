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
const defaultConfig = {
  'log.level': 'debug',
  'log.filePath': path.join(process.cwd(), 'log', 'sps.log'),
  'web.root': 'client/',
  'web.port': 8080
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
