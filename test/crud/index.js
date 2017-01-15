import mockery from 'mockery';
import sinon from 'sinon';
import chai from 'chai';
chai.should();

const crudModulePath = '../../src/js/crud/index.js';


describe('crud', function() {
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
    mockery.registerSubstitute('mongodb', '../../../test/mock/mongodb');
    mockery.registerAllowable(crudModulePath);
  });


  it('tests connect should connect to the db', function() {
    const dbURL = 'D-B-U-R-L';
    const mongodb = require('../mock/mongodb');
    const config = require('../mock/config').default;
    config.withArgs('db.url').returns(dbURL);
    const Crud = require(crudModulePath).default;
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
    const mongodb = require('../mock/mongodb');
    const config = require('../mock/config').default;
    config.withArgs('db.url').returns(dbURL);
    const Crud = require(crudModulePath).default;
    Crud.db = 'foo';
    return Crud.connect()
      .then(function(result) {
        mongodb.MongoClient.connect.callCount.should.equal(0);
        mongodb.MongoClient.connect.callCount.should.equal(0);
        result.should.equal('foo');
      });
  });


  it('tests initialise creates collections and sets flag', function() {
    // should create db collections for all the items named in the collections enum
    const mongodb = require('../mock/mongodb');
    const db = mongodb.db;
    const Crud = require(crudModulePath).default;
    db.collection.returns(Promise.resolve('-a-collection-'));
    Crud.connect = sinon.stub();
    Crud.connect.returns(Promise.resolve(db));
    return Crud
      .initialise()
      .then(function() {
        Crud.isInitialised.should.equal(true);
        for (let key in Crud.collectionName) {
          Crud.collections[key].should.equal('-a-collection-');
          db.collection.calledWith(key);
        }
      });
  });


  it('tests initialise does not call connect if already initialised', function() {
    const mongodb = require('../mock/mongodb');
    const Crud = require(crudModulePath).default;
    Crud.isInitialised = true;
    Crud.connect = sinon.stub();
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
    const Crud = require(crudModulePath).default;
    Crud.initialise = sinon.stub();
    Crud.initialise.returns(Promise.resolve());
    const {
      collection,
      findResult
    } = require('../mock/mongodb');
    const fakeCollection = collection(findResult('foo'));
    Crud.collections[Crud.CollectionName.Groups] = fakeCollection;
    return Crud
      .getGroups('bar')
      .then(function(result) {
        Crud.initialise.callCount.should.equal(1);
        fakeCollection.find.calledWith('bar');
        result.should.equal('foo');
      });
  });


  it('tests putGroups', function() {
    const Crud = require(crudModulePath).default;
    Crud.initialise = sinon.stub();
    Crud.initialise.returns(Promise.resolve());
    const { collection } = require('../mock/mongodb');
    const fakeCollection = collection();
    Crud.collections[Crud.CollectionName.Groups] = fakeCollection;
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


  it('tests getPictures', function() {
    const Crud = require(crudModulePath).default;
    Crud.initialise = sinon.stub();
    Crud.initialise.returns(Promise.resolve());
    const {
      collection,
      findResult
    } = require('../mock/mongodb');
    const fakeCollection = collection(findResult('foo'));
    Crud.collections[Crud.CollectionName.Pictures] = fakeCollection;
    return Crud
      .getPictures('bar')
      .then(function(result) {
        Crud.initialise.callCount.should.equal(1);
        fakeCollection.find.calledWith('bar');
        result.should.equal('foo');
      });
  });


  it('tests putPictures', function() {
    const Crud = require(crudModulePath).default;
    Crud.initialise = sinon.stub();
    Crud.initialise.returns(Promise.resolve());
    const { collection } = require('../mock/mongodb');
    const fakeCollection = collection();
    Crud.collections[Crud.CollectionName.Pictures] = fakeCollection;
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
});
