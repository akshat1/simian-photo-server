const mockery = require('mockery');
const sinon = require('sinon');
const chai = require('chai');
chai.should();


describe('server', function() {
  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });


  beforeEach(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    mockery.registerSubstitute('../config', '../../../test/mock/config');
    mockery.registerSubstitute('../logger', '../../../test/mock/logger');
    mockery.registerSubstitute('fs-extra', '../../../test/mock/fs-extra');
    mockery.registerSubstitute('express', '../../../test/mock/express');
    mockery.registerSubstitute('serve-static', '../../../test/mock/serve-static');
    mockery.registerSubstitute('body-parser', '../../../test/mock/body-parser');
    mockery.registerAllowable('../../src/js/server/server.js');
  });


  describe('setUpStaticServer()', function() {
    it('should setup serveStatic instances for public, thumbnails and previews', function() {
      const webRootPath = 'WEBROOTPATH';
      const ssWebRootPath = 'SS_WEBROOTPATH';
      const thumbnailDirPath = 'THUMBNAILDIRPATH';
      const ssThumbnailDirPath = 'SS_THUMBNAILDIRPATH';
      const imagePreviewPath = 'IMAGEPREVIEWPATH';
      const ssImagePreviewPath = 'SS_IMAGEPREVIEWPATH';
      const { config } = require('../mock/config');
      const fs = require('../mock/fs-extra');
      const express = require('../mock/express');
      const serveStatic = require('../mock/serve-static.js');
      config.withArgs('webserver.root.path').returns(webRootPath);
      config.withArgs('app.thumbnail.path').returns(thumbnailDirPath);
      config.withArgs('app.imagePreview.path').returns(imagePreviewPath);
      serveStatic.withArgs(webRootPath).returns(ssWebRootPath);
      serveStatic.withArgs(thumbnailDirPath).returns(ssThumbnailDirPath);
      serveStatic.withArgs(imagePreviewPath).returns(ssImagePreviewPath);
      const app = express();
      const Server = require('../../src/js/server/server.js');
      Server.setUpStaticServer(app).should.equal(app);

      fs.ensureDirSync.callCount.should.equal(3);
      fs.ensureDirSync.calledWith('webserver.root.path');
      fs.ensureDirSync.calledWith('app.thumbnail.path');
      fs.ensureDirSync.calledWith('app.imagePreview.path');

      serveStatic.callCount.should.equal(3);
      serveStatic.calledWith(webRootPath);
      serveStatic.calledWith(thumbnailDirPath);
      serveStatic.calledWith(imagePreviewPath);

      app.use.callCount.should.equal(3);
      app.use.calledWith('/', ssWebRootPath);
      app.use.calledWith('/thumbnail', ssThumbnailDirPath);
      app.use.calledWith('/preview', ssImagePreviewPath);
    });
  });


  describe('startWebServer()', function() {
    it('should call startWebServer, use bodyParser and listen on configured port', function() {
      const jsonParser = 'JSON-PARSER';
      const express = require('../mock/express');
      const bodyParser = require('../mock/body-parser.js');
      const Server = require('../../src/js/server/server.js');
      const { config } = require('../mock/config');
      const listenPort = 'WEBSERVER.PORT';
      Server.setUpStaticServer = sinon.stub();
      bodyParser.json.returns(jsonParser);
      config.withArgs('webserver.port').returns(listenPort);

      Server.startWebServer();

      const app = express();
      Server.setUpStaticServer.calledWith(app);
      Server.setUpStaticServer.callCount.should.equal(1);
      app.use.calledWith(jsonParser);
      app.listen.callCount.should.equal(1);
      app.listen.calledWith(listenPort, Server.handleServerStart);
    });
  });
});
