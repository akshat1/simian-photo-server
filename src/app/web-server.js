'use strict';

const winston = require('winston');
const config = require('./config.js');
//const fs = require('fs-extra');
const path = require('path');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const graphQlSchema = require('./graphql/schema.js');
//const mime = require('mime');

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: config('web.log.level'),
      colorize: true
    }),

    new winston.transports.File({
      level: config('web.log.level'),
      filename: config('web.log.filePath')
    })
  ]
});


const app = express();
function setUp() {
  logger.debug('setUp');
  // parse json requests
  app.use(bodyParser.json());

  // set up static file serving
  const webRoot = path.join(process.cwd(), config('web.root'));
  logger.info('webRoot: ', webRoot);
  app.use('/', serveStatic(webRoot));
  app.use('/graphql', graphqlHTTP({
    schema: graphQlSchema,
    graphiql: true,
    formatError: error => ({
      message: error.message,
      locations: error.locations,
      stack: error.stack
    })
  }));
}


function start() {
  logger.debug('start');
  setUp();
  const listenPort = Number(config('web.port'));
  logger.info('port: ', listenPort);
  app.listen(listenPort, handleServerStart);
}


function handleServerStart() {
  logger.info('web server started');
  logger.info(`listening at ${this.address()}`);
}


module.exports = {
  start
};
