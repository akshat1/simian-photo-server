'use strict';

const winston = require('winston');
const path = require('path');
const fs = require('fs-extra');


module.exports = (level, filePath) => {
  fs.ensureDirSync(path.dirname(filePath));

  return new winston.Logger({
    transports: [
      new winston.transports.Console({
        level,
        colorize: true,
        exitOnError: false
      }),

      new winston.transports.File({
        level,
        filename: filePath,
        exitOnError: false
      })
    ]
  });
};
