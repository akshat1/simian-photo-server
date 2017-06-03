const { config } = require('../config');
const { getLogger } = require('../logger');
const path = require('path');
const fs = require('fs-extra');
const express = require('express');
const { setUpStaticServer } = require('./static-server.js');
const { setUpRestApi } = require('./api-server.js');



const logger = getLogger({
  level: config('webserver.log.level'),
  filePath: config('webserver.log.path')
});


const Server = module.exports = {
  setUpStaticServer,
  setUpRestApi
};


/**
 * @memberof module:server
 * @alias startWebServer
 * @description Starts the entire web-server
 */
Server.startWebServer = function() {
  logger.debug('startWebServer');
  const app = express();
  Server.setUpStaticServer(app);
  Server.setUpRestApi(app);
  /*app.use('/', function(req, res) {
    res.redirect('/app');
  });*/
  const listenPort = Number(config('webserver.port'));
  app.listen(listenPort, Server.handleServerStart);
  logger.info(`Listening at port: ${listenPort}`);
  logger.debug('done');
};


/**
 * @memberof module:server
 * @alias handleServerStart
 * @description Handle server start event. Empty for now.
 */
/* istanbul ignore next */
Server.handleServerStart = function() {
  logger.debug('handleServerStart');
  logger.info(`web server started listening at ${this.address()}`);
};


module.exports = Server;
