const StubManager = require('../mock/stub-manager.js');
import mockery from 'mockery';
import sinon from 'sinon';
import chai from 'chai';
chai.should();


describe('crud', function() {
  let Crud,
      config,
      logger,
      mongodb;

  before(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    const oConfig = require('../mock/config');
    config = oConfig.config;
    logger = require('../mock/logger');
    mongodb = require('../mock/mongodb');
    mockery.registerMock('../config', oConfig);
    mockery.registerMock('../logger', logger);
    mockery.registerMock('mongodb', mongodb);

    Crud = require('../../src/js/crud/index.js')
  });


  after(function() {
    mockery.deregisterAll();
    mockery.disable();
  });


  afterEach(function() {
    config.reset();
    logger.logger.reset();
    mongodb.resetAll();
    StubManager.restoreAll();
  });


  it('tests connect should connect to the db', function() {
    const dbURL = 'D-B-U-R-L';
    config.withArgs('db.url').returns(dbURL);
    return Crud.connect()
      .then(function(result) {
        mongodb.MongoClient.connect.calledWith(dbURL);
        mongodb.MongoClient.connect.callCount.should.equal(1);
        Crud.db.should.equal(mongodb.db);
        result.should.equal(mongodb.db);
      });
  });


  it('tests connect does not try to connect if already connected', function() {
    const dbURL = 'D-B-U-R-L';
    config.withArgs('db.url').returns(dbURL);
    Crud.db = 'foo';
    return Crud.connect()
      .then(function(result) {
        mongodb.MongoClient.connect.callCount.should.equal(0);
        result.should.equal('foo');
      });
  });


  it('tests initialise creates collections and sets flag', function() {
    // should create db collections for all the items named in the collections enum
    const db = mongodb.db;
    db.collection.returns(Promise.resolve('-a-collection-'));
    StubManager.stub(Crud, 'connect');
    Crud.connect.returns(Promise.resolve(db));
    return Crud
      .initialise()
      .then(function() {
        Crud.isInitialised.should.equal(true);
        for (const key in Crud.collectionName) {
          Crud.collections[key].should.equal('-a-collection-');
          db.collection.calledWith(key);
        }
      });
  });


  it('tests initialise does not call connect if already initialised', function() {
    Crud.isInitialised = true;
    StubManager.stub(Crud, 'connect');
    Crud.connect.returns(Promise.resolve('bar'));
    const db = mongodb.db;
    db.collection.returns(Promise.resolve('-a-collection-'));
    return Crud
      .initialise()
      .then(function() {
        Crud.connect.callCount.should.equal(0);
        db.collection.callCount.should.equal(0);
      });
  });


  it('tests getGroups', function() {
    StubManager.stub(Crud, 'initialise');
    Crud.initialise.returns(Promise.resolve());
    const {
      collection,
      findResult
    } = mongodb;
    const fakeCollection = collection(findResult('foo'));
    Crud.collections[Crud.CollectionName.groups] = fakeCollection;
    return Crud
      .getGroups('bar')
      .then(function(result) {
        Crud.initialise.callCount.should.equal(1);
        fakeCollection.find.calledWith('bar');
        result.should.equal('foo');
      });
  });


  it('tests putGroups', function() {
    StubManager.stub(Crud, 'initialise');
    Crud.initialise.returns(Promise.resolve());
    const { collection } = mongodb;
    const fakeCollection = collection();
    Crud.collections[Crud.CollectionName.groups] = fakeCollection;
    return Crud
      .putGroups(['a', 'b', 'c'])
      .then(function(result) {
        Crud.initialise.callCount.should.equal(1);
        fakeCollection.update.calledWith('a');
        fakeCollection.update.calledWith('b');
        fakeCollection.update.calledWith('c');
        fakeCollection.update.callCount.should.equal(3);
        result.should.eql(['a', 'b', 'c']);
      });
  });


  it('tests deleteGroups with no query', function(done) {
    const getCollection = StubManager.stub(Crud, 'getCollection');
    const { collection } = mongodb;
    const fakeCollection = collection();
    getCollection.returns(fakeCollection);
    Crud.deleteGroups()
      .catch(function(err) {
        err.should.be.an('error');
        done();
      });
  });


  it('tests deleteGroups with invalid query', function(done) {
    const getCollection = StubManager.stub(Crud, 'getCollection');
    const { collection } = mongodb;
    const fakeCollection = collection();
    getCollection.returns(fakeCollection);
    Crud.deleteGroups({})
      .catch(function(err) {
        err.should.be.an('error');
        done();
      });
  });


  it('tests getPictures', function() {
    StubManager.stub(Crud, 'initialise');
    Crud.initialise.returns(Promise.resolve());
    const {
      collection,
      findResult
    } = mongodb;
    const fakeCollection = collection(findResult('foo'));
    Crud.collections[Crud.CollectionName.pictures] = fakeCollection;
    return Crud
      .getPictures('bar')
      .then(function(result) {
        Crud.initialise.callCount.should.equal(1);
        fakeCollection.find.calledWith('bar');
        result.should.equal('foo');
      });
  });


  it('tests putPictures', function() {
    StubManager.stub(Crud, 'initialise');
    Crud.initialise.returns(Promise.resolve());
    const { collection } = mongodb;
    const fakeCollection = collection();
    Crud.collections[Crud.CollectionName.pictures] = fakeCollection;
    return Crud
      .putPictures(['a', 'b', 'c'])
      .then(function(result) {
        Crud.initialise.callCount.should.equal(1);
        fakeCollection.update.calledWith('a');
        fakeCollection.update.calledWith('b');
        fakeCollection.update.calledWith('c');
        fakeCollection.update.callCount.should.equal(3);
        result.should.eql(['a', 'b', 'c']);
      });
  });


  it('tests deletePictures with no query', function(done) {
    const getCollection = StubManager.stub(Crud, 'getCollection');
    const { collection } = mongodb;
    const fakeCollection = collection();
    getCollection.returns(fakeCollection);
    Crud.deletePictures()
      .catch(function(err) {
        err.should.be.an('error');
        done();
      });
  });


  it('tests deletePictures with invalid query', function(done) {
    const getCollection = StubManager.stub(Crud, 'getCollection');
    const { collection } = mongodb;
    const fakeCollection = collection();
    getCollection.returns(fakeCollection);
    Crud.deletePictures({})
      .catch(function(err) {
        err.should.be.an('error');
        done();
      });
  });
});
