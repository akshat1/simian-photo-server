'use strict';

const winston = require('winston');
const config = require('./config.js');
const fs = require('fs-extra');
const path = require('path');
const webServer = require('./web-server.js');

fs.ensureDirSync(path.dirname(config('log.filePath')));

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: config('log.level'),
      colorize: true
    }),

    new winston.transports.File({
      level: config('log.level'),
      filename: config('log.filePath')
    })
  ]
});


logger.info('simian Photo Server start');
logger.info('starting web-server');
webServer.start();
