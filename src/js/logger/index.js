/**
@module logger
@description A logger module (built as an abstraction around winston). Exposes a getLogger function which will return a simple logger.
*/
import winston from 'winston';
import path from 'path';
import fs from 'fs-extra';


/**
@typedef {Object} Logger
@property {function} info
@property {function} debug
@property {function} warn
@property {function} error
*/


/**
@param {Object} opts
@param {String} opts.level.console
@param {String} opts.level.file
@param {String} opts.filePath
@return {Array} - an array of winston transports.
*/
export function _getTransports({ filePath, level = {} }) {
  return [
    new winston.transports.Console({
      level: level.console,
      colorize: true,
      exitOnError: false
    }),
    new winston.transports.File({
      level: level.file || 'debug',
      filename: filePath,
      exitOnError: false
    })
  ];
}


/**
@param {Object} opts
@param {String} opts.level - debugger level
@param {String} opts.filePath
@param {String} [opts.fileLevel] - optional level override when logging to file
@returns {Logger}
*/
export function getLogger(opts = {}) {
  if (!opts.filePath)
    throw new Error('log file location not provided to logger');

  fs.ensureDirSync(path.dirname(opts.filePath));
  const logger = new winston.Logger({
    transports: _getTransports(opts)
  });

  /*
  Instead of returning the winston logger, we return a very dumb object with just four functions.
  That is be design, in order to minimise our dependence on winston in case we have to use
  something else in the future.
  */
  return {
    _winstonLogger: logger,
    info: logger.info.bind(logger),
    debug: logger.debug.bind(logger),
    warn: logger.warn.bind(logger),
    error: logger.error.bind(logger)
  };
}

export default getLogger;
