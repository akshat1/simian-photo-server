'use strict';

const config = require('../config.js');
const logger = require('../logger.js')(config('crawler.log.level'), config('crawler.log.filePath'));
const _ = require('lodash');
const IPC = require('node-ipc');
const events = require('./events.js');
const fs = require('fs-extra');
const Path = require('path');
const adapter = require('../file-adapter.js');

const IPCConfig = {
  appspace: 'sps',
  id: 'fs-walker',
  retry: 50,
  silent: true,
  colorize: true
};


/* ********************************************************************************************* */
const scanQueue = [];
function qPush(paths) {
  logger.debug('qPush');
  if (typeof paths === 'string')
    scanQueue.push(paths);

  else if (Array.isArray(paths))
    //scanQueue.unshift(paths);
    Array.prototype.unshift.apply(scanQueue, paths);

  else
    throw new Error('Invalid argument sent to qPush');

  processQueue();
}


function qPop() {
  logger.debug('qPop');
  return scanQueue.pop();
}


function processQueue() {
  logger.debug('processQueue');
  if (scanQueue.length) {
    processPath(qPop())
      .then(processQueue)
      .catch(processQueue);
  }
}


function processPath(path) {
  console.log(`processPath(${path})`);
  return new Promise(function (resolve, reject) {
    function onStat(err, stats) {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        if (stats.isDirectory()) {
          resolve(processDirectory(path));
        } else {
          resolve(processFile(path));
        }
        resolve();
      }
    }

    fs.stat(path, onStat);
  });
}


function processDirectory(path) {
  return new Promise(function (resolve, reject) {
    function onListing(err, files) {
      if (err) {
        reject(err);
      } else {
        for (const file of files) {
          qPush(Path.join(path, file));
        }
        resolve();
      }
    }

    fs.readdir(path, onListing);
  });
}


function processFile(path) {
  logger.debug(`processFile(${path})`);
  return adapter.processFile(path)
    .then(result => {
      if (result)
        signalFileFound(result);
    });
}


/* ********************************************************************************************* */
function handleScanEvent({ directories }) {
  logger.debug('handleScanEvent');
  qPush(directories);
}


function signalFileFound(file) {
  IPC.of.server.emit(events.FILE_FOUND, {
    file
  });
}


function handleIPCConnect() {
  logger.debug('handleIPCConnect');
  IPC.of.server.on(events.SCAN, handleScanEvent);
}

_.merge(IPC.config, IPCConfig);
logger.debug('Connecting to IPC server');
IPC.connectTo('server', handleIPCConnect);
