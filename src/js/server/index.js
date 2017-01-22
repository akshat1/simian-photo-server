/**
@module server
@description Initialises the web-server using the Server class within this module.
*/

const Server = require('./server.js');
const DB = require('./db');
Server.startWebServer();
