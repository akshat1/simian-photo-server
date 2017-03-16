const mockery = require('mockery');
const sinon = require('sinon');
const chai = require('chai');
const hashes = require('node-hashes');
const StubManager = require('../mock/stub-manager.js');
chai.should();

const THUMBNAIL_DIR_PATH = 'THUMBNAIL_DIR_PATH';
const PREVIEW_DIR_PATH = 'PREVIEW_DIR_PATH';
const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 300;
const PREVIEW_WIDTH = 800;
const PREVIEW_HEIGHT = 600;

describe('crawler', function() {
  let Crawler;
  let config;
  let fs;
  let walk;
  let Crud;
  let Image;

  before(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    walk = require('../mock/walk.js');
    Image = require('../mock/image.js');
    Crud = require('../mock/crud.js');
    const oConfig = require('../mock/config.js');
    config = oConfig.config;
    config.withArgs('system.thumbnailDirPath').returns(THUMBNAIL_DIR_PATH);
    config.withArgs('system.previewDirPath').returns(PREVIEW_DIR_PATH);
    config.withArgs('system.image.thumbnail.width').returns(THUMBNAIL_WIDTH);
    config.withArgs('system.image.thumbnail.height').returns(THUMBNAIL_HEIGHT);
    config.withArgs('system.image.preview.width').returns(PREVIEW_WIDTH);
    config.withArgs('system.image.preview.height').returns(PREVIEW_HEIGHT);
    fs = require('../mock/fs-extra.js');
    mockery.registerMock('walk', walk);
    mockery.registerMock('fs-extra', fs);
    mockery.registerMock('../config', oConfig);
    mockery.registerMock('../crud', Crud);
    mockery.registerMock('../image', Image);
    mockery.registerSubstitute('../logger', '../../../test/mock/logger');
    // And now we can load crawler
    Crawler = require('../../src/js/crawler');
  });


  after(function() {
    mockery.deregisterAll();
    mockery.disable();
  });


  afterEach(function() {
    config.reset();
    fs.reset();
    StubManager.restoreAll();
    walk.resetAll();
    Crud.resetAll();
    Image.resetAll();
  })


  it('scanAll', function() {
    const fakeRoots = ['foo', 'bar', 'baz'];
    config.withArgs('system.fs.directories').returns(fakeRoots);
    const _startWalking = StubManager.stub(Crawler, 'startWalking');
    _startWalking.returns(Promise.resolve());
    return Crawler
      .scanAll()
      .then(function() {
        _startWalking.args.forEach(
          (args, callNumber) => args[0].should.equal(fakeRoots[callNumber])
        );
        _startWalking.restore();
      });
  });


  it('prepFileSystem', function() {
    config.withArgs('system.thumbnailDirPath').returns('foo1');
    config.withArgs('system.previewDirPath').returns('bar1');
    Crawler.prepFileSystem();
    fs.ensureDirSync.calledWith('foo1');
    fs.ensureDirSync.calledWith('bar1');
  });


  it('startWalking', function() {
    const _prepFileSystem = StubManager.stub(Crawler, 'prepFileSystem');
    walk.walker.on.withArgs('end').callsArg(1);
    return Crawler
      .startWalking('FOO')
      .then(function() {
        walk.walk.calledOnce.should.equal(true);
        walk.walk.calledWith('FOO').should.equal(true);
        const args = walk.walker.on.args;
        let verifiedFile = !!args.find(
          ([evName, fn]) => evName === 'file' && fn === Crawler.handleFile
        );

        let verifiedErrors = !!args.find(
          ([evName, fn]) => evName === 'errors' && fn === Crawler.handleErrors
        );

        let verifiedEnd = !!args.find(
          ([evName, fn]) => evName === 'file' && typeof fn === 'function'
        );

        verifiedFile.should.equal(true);
        verifiedErrors.should.equal(true);
        verifiedEnd.should.equal(true);
      });
  });


  it('saveDirectoryIfNeeded - saves the first time around', function() {
    const dirPath = 'foo/bar/baz';
    const storedDirectory = {};
    Crud.putGroups.returns(Promise.resolve());
    Crud.getGroups.returns(Promise.resolve([storedDirectory]));
    (typeof Crawler.directoryStoredFlags[dirPath]).should.equal('undefined');
    return Crawler
      .saveDirectoryIfNeeded(dirPath)
      .then(function() {
        Crud.putGroups.calledOnce.should.equal(true);
        Crud.putGroups.args[0].should.eql([
          [{
            name: 'baz',
            type: Crud.GroupType.directory,
            dirPath
          }]
        ]);
        Crawler.directoryStoredFlags[dirPath].should.equal(storedDirectory);
        delete Crawler.directoryStoredFlags[dirPath];
      });
  });


  it('saveDirectoryIfNeeded - does not save twice', function() {
    const dirPath = 'foo/bar/baz';
    Crud.putGroups.returns(Promise.resolve());
    (typeof Crawler.directoryStoredFlags[dirPath]).should.equal('undefined');
    Crawler.directoryStoredFlags[dirPath] = true;
    return Crawler
      .saveDirectoryIfNeeded(dirPath)
      .then(function() {
        Crud.putGroups.callCount.should.equal(0);
        delete Crawler.directoryStoredFlags[dirPath];
      });
  });


  it('isNewFile returns true when file has not been seen before', function() {
    const filePath = 'foo/bar/baz';
    Crud.getPictures.returns(Promise.resolve([]));
    return Crawler
      .isNewFile(filePath, {})
      .then(function(res) {
        res.should.equal(true);
        Crud.getPictures.calledOnce.should.equal(true);
      })
  });


  it('isNewFile returns false when file has been modified since last seen', function() {
    const filePath = 'foo/bar/baz';
    const baselineTime = Date.now();
    const storedPicture = {
      fileStats: {
        mtime: { getTime: () => baselineTime}
      }
    };

    const fileStat = {
      mtime: { getTime: () => baselineTime + 1 }
    };

    Crud.getPictures.returns(Promise.resolve([storedPicture]));
    return Crawler
      .isNewFile(filePath, fileStat)
      .then(function(res) {
        res.should.equal(true);
        Crud.getPictures.calledOnce.should.equal(true);
      })
  });


  it('isNewFile returns true when file has not been modified since last seen', function() {
    const filePath = 'foo/bar/baz';
    const baselineTime = Date.now();
    const storedPicture = {
      fileStats: {
        mtime: { getTime: () => baselineTime}
      }
    };

    const fileStat = {
      mtime: { getTime: () => baselineTime }
    };

    Crud.getPictures.returns(Promise.resolve([storedPicture]));
    return Crawler
      .isNewFile(filePath, fileStat)
      .then(function(res) {
        res.should.equal(false);
        Crud.getPictures.calledOnce.should.equal(true);
      })
  });


  it('handleFile does nothing if not an image file', function() {
    const root = 'foo/bar';
    const fileName = 'baz';
    const fileStats = {
      name: fileName
    };
    const next = sinon.stub();
    Image.isImageFile.returns(Promise.resolve(false));
    StubManager.stub(Crawler, 'saveDirectoryIfNeeded');
    return Crawler
      .handleFile(root, fileStats, next)
      .then(function() {
        Image.getExif.callCount.should.equal(0);
        Image.resize.callCount.should.equal(0);
        Crud.putPictures.callCount.should.equal(0);
        Crawler.saveDirectoryIfNeeded.callCount.should.equal(0);
      });
  });


  it('handleFile does nothing if not a new file', function() {
    const root = 'foo/bar';
    const fileName = 'baz';
    const fileStats = {
      name: fileName
    };
    const next = sinon.stub();
    StubManager.stub(Crawler, 'saveDirectoryIfNeeded');
    StubManager.stub(Crawler, 'isNewFile');
    Image.isImageFile.returns(Promise.resolve(true));
    Crawler.isNewFile.returns(Promise.resolve(false));
    return Crawler
      .handleFile(root, fileStats, next)
      .then(function() {
        Image.getExif.callCount.should.equal(0);
        Image.resize.callCount.should.equal(0);
        Crud.putPictures.callCount.should.equal(0);
        Crawler.saveDirectoryIfNeeded.callCount.should.equal(0);
      });
  });


  it('handleFile when encountering a new image file', function() {
    const root = 'foo/bar';
    const fileName = 'baz';
    const filePath = `${root}/${fileName}`;
    const thumbnailPath = `${THUMBNAIL_DIR_PATH}/${hashes.JSHash(filePath)}.png`;
    const previewPath = `${PREVIEW_DIR_PATH}/${hashes.JSHash(filePath)}.png`;
    const fileStats = {
      name: fileName
    };
    const next = sinon.stub();
    const exif = {};
    StubManager.stub(Crawler, 'saveDirectoryIfNeeded');
    StubManager.stub(Crawler, 'isNewFile');
    Image.isImageFile.returns(Promise.resolve(true));
    Image.getExif.returns(Promise.resolve(exif));
    Image.resize.returns(Promise.resolve());
    Crud.putPictures.returns(Promise.resolve());
    Crawler.isNewFile.returns(Promise.resolve(true));
    Crawler.saveDirectoryIfNeeded.returns(Promise.resolve(true));
    return Crawler
      .handleFile(root, fileStats, next)
      .then(function() {
        Image.getExif.callCount.should.equal(1);
        Image.getExif.calledWith(filePath);
        Image.resize.callCount.should.equal(2);
        Image.resize.calledWith(
          filePath,
          thumbnailPath,
          THUMBNAIL_WIDTH,
          THUMBNAIL_HEIGHT
          ).should.equal(true);
        Image.resize.calledWith(
          filePath,
          previewPath,
          PREVIEW_WIDTH,
          PREVIEW_HEIGHT
          ).should.equal(true);
        Crud.putPictures.callCount.should.equal(1);
        Crud.putPictures.args[0].should.eql([
          [{
            filePath,
            thumbnailPath,
            previewPath,
            metadata: exif,
            fileStats
          }]
        ]);
        Crawler.saveDirectoryIfNeeded.calledWith(root).should.equal(true);
      });
  });


  it('handleErrors', function() {
    const next = sinon.stub();
    Crawler.handleErrors('', [], next);
    next.calledOnce.should.equal(true);
  });
});