const StubManager = require('../mock/stub-manager.js');
import mockery from 'mockery';
import sinon from 'sinon';
import chai from 'chai';
chai.should();


describe('crud', function() {
  let Crud,
      config,
      logger,
      mongodb,
      collection,
      cursor;

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
    collection = mongodb.collection;
    cursor = mongodb.cursor;
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


  it('tests connect should connect to the db', async function() {
    const dbURL = 'D-B-U-R-L';
    config.withArgs('db.url').returns(dbURL);    
    const result = await Crud.connect();
    mongodb.MongoClient.connect.calledWith(dbURL);
    mongodb.MongoClient.connect.callCount.should.equal(1);
    Crud.db.should.equal(mongodb.db);
    result.should.equal(mongodb.db);
  });


  it('tests connect does not try to connect if already connected', async function() {
    const dbURL = 'D-B-U-R-L';
    config.withArgs('db.url').returns(dbURL);
    Crud.db = 'foo';
    const result =await Crud.connect();
    mongodb.MongoClient.connect.callCount.should.equal(0);
    result.should.equal('foo');
  });


  it('tests initialise creates collections and sets flag', async function() {
    // should create db collections for all the items named in the collections enum
    const db = mongodb.db;
    db.collection.returns(Promise.resolve('-a-collection-'));
    StubManager.stub(Crud, 'connect');
    Crud.connect.returns(Promise.resolve(db));
    await Crud.initialise();
    Crud.isInitialised.should.equal(true);
    for (const key in Crud.collectionName) {
      Crud.collections[key].should.equal('-a-collection-');
      db.collection.calledWith(key);
    }
  });


  it('tests initialise does not call connect if already initialised', async function() {
    Crud.isInitialised = true;
    StubManager.stub(Crud, 'connect');
    Crud.connect.returns(Promise.resolve('bar'));
    const db = mongodb.db;
    db.collection.returns(Promise.resolve('-a-collection-'));
    await Crud.initialise();
    Crud.connect.callCount.should.equal(0);
    db.collection.callCount.should.equal(0);
  });


  it('tests getItems', async function() {
    const query = {};
    const skip = 10;
    const limit = 20;
    const sort = {
      bar: 1,
      baz: -1
    };
    const projection = {
      quux: 1,
      zuux: 0
    };
    const fakeCursor = cursor(['foo'])
    const fakeCollection = collection(fakeCursor);
    StubManager.stub(Crud, 'initialise', Promise.resolve());
    StubManager.stub(Crud, 'getCollection', Promise.resolve(fakeCollection));
    const result = await Crud.getItems('bar', query, {
      pagination: {
        limit,
        skip
      },
      sort,
      projection,
      includeSupplemental: true
    });

    result.should.eql({
      data: ['foo'],
      sort,
      pagination: {
        skip,
        limit,
        total: 1,
        returned: 1
      }
    });
    fakeCollection.find.calledWith(query, projection).should.equal(true);
    fakeCursor.sort.calledWith(sort).should.equal(true);
    fakeCursor.skip.calledWith(skip).should.equal(true);
    fakeCursor.limit.calledWith(limit).should.equal(true);    
  });


  it('tests getGroups', async function() {
    StubManager.stub(Crud, 'initialise');
    Crud.initialise.returns(Promise.resolve());
    const fakeCollection = collection(cursor('foo'));
    Crud.collections[Crud.CollectionName.groups] = fakeCollection;
    const result = await Crud.getGroups('bar');
    Crud.initialise.callCount.should.equal(1);
    fakeCollection.find.calledWith('bar');
    result.should.equal('foo');
  });


  it('tests putGroups', async function() {
    StubManager.stub(Crud, 'initialise');
    Crud.initialise.returns(Promise.resolve());
    const fakeCollection = collection();
    Crud.collections[Crud.CollectionName.groups] = fakeCollection;
    const result = await Crud.putGroups(['a', 'b', 'c']);
    Crud.initialise.callCount.should.equal(1);
    fakeCollection.update.calledWith('a');
    fakeCollection.update.calledWith('b');
    fakeCollection.update.calledWith('c');
    fakeCollection.update.callCount.should.equal(3);
    result.should.eql(['a', 'b', 'c']);
  });


  it('tests deleteGroups with no query', function(done) {
    const getCollection = StubManager.stub(Crud, 'getCollection');
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
    const fakeCollection = collection();
    getCollection.returns(fakeCollection);
    Crud.deleteGroups({})
      .catch(function(err) {
        err.should.be.an('error');
        done();
      });
  });


  it('tests deleteGroups with valid query', async function () {
    const expectedNRemoved = 5;
    const query = {foo: 'bar'};
    const getCollection = StubManager.stub(Crud, 'getCollection');
    const fakeCollection = collection();
    fakeCollection.remove.returns(Promise.resolve({ nRemoved: expectedNRemoved }))
    getCollection.returns(fakeCollection);
    const nRemoved = await Crud.deleteGroups(query);
    fakeCollection.remove.calledWith(query);
    nRemoved.should.equal(expectedNRemoved);
  });


  it('tests getPictures', async function() {
    StubManager.stub(Crud, 'initialise');
    Crud.initialise.returns(Promise.resolve());
    const fakeCollection = collection(cursor('foo'));
    Crud.collections[Crud.CollectionName.pictures] = fakeCollection;
    const result = await Crud.getPictures('bar');
    Crud.initialise.callCount.should.equal(1);
    fakeCollection.find.calledWith('bar');
    result.should.equal('foo');
  });


  it('tests putPictures', async function() {
    StubManager.stub(Crud, 'initialise');
    Crud.initialise.returns(Promise.resolve());
    const fakeCollection = collection();
    Crud.collections[Crud.CollectionName.pictures] = fakeCollection;
    const result = await Crud.putPictures(['a', 'b', 'c']);
    Crud.initialise.callCount.should.equal(1);
    fakeCollection.update.calledWith('a');
    fakeCollection.update.calledWith('b');
    fakeCollection.update.calledWith('c');
    fakeCollection.update.callCount.should.equal(3);
    result.should.eql(['a', 'b', 'c']);
  });


  it('tests deletePictures with no query', function(done) {
    const getCollection = StubManager.stub(Crud, 'getCollection');
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
    const fakeCollection = collection();
    getCollection.returns(fakeCollection);
    Crud.deletePictures({})
      .catch(function(err) {
        err.should.be.an('error');
        done();
      });
  });


  it('tests deletePictures with valid query', async function () {
    const expectedNRemoved = 5;
    const query = {foo: 'bar'};
    const getCollection = StubManager.stub(Crud, 'getCollection');
    const fakeCollection = collection();
    fakeCollection.remove.returns(Promise.resolve({ nRemoved: expectedNRemoved }))
    getCollection.returns(fakeCollection);
    const nRemoved = await Crud.deletePictures(query);
    fakeCollection.remove.calledWith(query);
    nRemoved.should.equal(expectedNRemoved);
  });


  it('tests putPicturesInGroup', async function () {
    const groupId = 5;
    const existingPictureIds = [0, 1, 2, 3, 4, 5];
    const newPictureIds = [3, 4, 5, 6, 7, 8, 9];
    const existingRecord = {
      groupId,
      pictureIds: existingPictureIds
    };
    const fakeCollection = collection(cursor([existingRecord]));
    const getCollection = StubManager.stub(Crud, 'getCollection', fakeCollection)
    const result = await Crud.putPicturesInGroup(groupId, ...newPictureIds);
    fakeCollection.update.calledOnce.should.equal(true);
    const [testQuery, testRecord, testUpsert] = fakeCollection.update.args[0];
    testQuery.should.eql({ groupId });
    testRecord.should.eql({
      groupId,
      pictureIds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    });
  });


  it('tests putPicturesInGroup - no existing record', async function () {
    const groupId = 5;
    const newPictureIds = [3, 4, 5, 6, 7, 8, 9];
    const fakeCollection = collection(cursor([]));
    const getCollection = StubManager.stub(Crud, 'getCollection', fakeCollection)
    const result = await Crud.putPicturesInGroup(groupId, ...newPictureIds);
    fakeCollection.update.calledOnce.should.equal(true);
    const [testQuery, testRecord, testUpsert] = fakeCollection.update.args[0];
    testQuery.should.eql({ groupId });
    testRecord.should.eql({
      groupId,
      pictureIds: newPictureIds
    });
  });


  it('tests getPicturesInGroup', async function () {
    const groupId = 3;
    const expectedPictureIds = [0, 1, 4, 7, 2];
    const fakeCollection = collection(cursor([{
      groupId,
      pictureIds: expectedPictureIds
    }]));
    const getCollection = StubManager.stub(Crud, 'getCollection', fakeCollection)
    const result = await Crud.getPicturesInGroup(groupId);
    result.should.eql(expectedPictureIds);
  });


  it('tests getPicturesInGroup - no record', async function () {
    const fakeCollection = collection(cursor([]));
    const getCollection = StubManager.stub(Crud, 'getCollection', fakeCollection)
    const result = await Crud.getPicturesInGroup(4);
    result.should.eql([]);
  });
});
