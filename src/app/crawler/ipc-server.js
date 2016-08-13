'use strict';
/*
 This should be an IPC server, talking to an IPC client. The IPC client is what will actually be
 crawling the FS.
*/

const config = require('../config.js');
const logger = require('../logger.js')(config('crawler.log.level'), config('crawler.log.filePath'));
const _ = require('lodash');
const IPC = require('node-ipc');
const db = require('../db.js');
const childProcess = require('child_process');
const path = require('path');
const events = require('./events.js');


const IPCConfig = {
  appspace: 'sps',
  id: 'server',
  silent: true,
  retry: 1500,
  colorize: true
};


function handleIPCStart() {
  logger.debug('IPC Server Started');
  logger.info('Starting fs-walker');
  const walkerFileName = path.join(__dirname, './fs-walker.js');
  console.log('walkerFileName: ', walkerFileName);
  childProcess.fork(walkerFileName);
  setTimeout(startScanning, 500);
}


function handleFileFound(payload) {
  logger.debug('handleFileFound', payload);
  db.upsertFile(payload.file);
}


function start() {
  logger.info('starting IPC');
  _.merge(IPC.config, IPCConfig);
  IPC.serve();
  IPC.server.on('start', handleIPCStart);
  IPC.server.on(events.FILE_FOUND, handleFileFound);
  IPC.server.start();
}


function stop() {}


function startScanning() {
  logger.debug('startScanning');
  IPC.server.broadcast(events.SCAN, {
    directories: config('directories')
  });
}


module.exports = {
  start,
  stop
};
