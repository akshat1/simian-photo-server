'use strict';

const config = require('./config.js');
const logger = require('./logger.js')(config('log.level'), config('log.filePath'));
const webServer = require('./web-server.js');
const crawler = require('./crawler/ipc-server.js');

logger.info('simian Photo Server start');
logger.info('starting web-server');
console.log(`crawler.auto.scan is ${config('crawler.auto.scan')}`);
if (config('crawler.auto.scan'))
  crawler.start();
webServer.start();
