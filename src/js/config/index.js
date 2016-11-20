/**
@module config
@description Exposes itself as a function which itself is a wrapper around nconf.get. Uses command
line, environment, config file and defaults; in this order.
*/
import nconf from 'nconf';
import path from 'path';


const configFilePath = path.join(process.cwd(), 'config.json');
const logDir = path.join(process.cwd(), 'log');
const defaultConfig = {
  // logging
  'log.level': 'debug',
  'log.filePath': path.join(logDir, 'server.log')

  // web server
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


/**
@function
@param {String} key
@returns {Object|Number|String} value
*/
const config = nconf.get.bind(nconf);
// usage: value = config('key')
export default config;
