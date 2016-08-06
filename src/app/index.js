'use strict';

const winston = require('winston');
const config = require('./config.js');
const fs = require('fs-extra');
const path = require('path');

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

console.log('Hello');
logger.debug('TESTING LOG');
