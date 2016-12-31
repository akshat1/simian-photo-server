import mockery from 'mockery';
import sinon from 'sinon';
import chai from 'chai';
chai.should();

const dbModulePath = '../../src/js/db/index.js';


describe('db', function() {
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
    mockery.registerAllowable(dbModulePath);
  });


  it('tests connect should connect to the DB', function() {
    const dbURL = 'D-B-U-R-L';
    const mongodb = require('../mock/mongodb');
    const config = require('../mock/config').default;
    config.withArgs('db.url').returns(dbURL);
    const DB = require(dbModulePath).default;
    return DB.connect()
      .then(function(result) {
        mongodb.MongoClient.connect.calledWith(dbURL);
        mongodb.MongoClient.connect.callCount.should.equal(1);
        result.should.equal(mongodb.db);
      });
  });


  it('tests connect should connect to the DB only once', function() {
    const dbURL = 'D-B-U-R-L';
    const mongodb = require('../mock/mongodb');
    const config = require('../mock/config').default;
    config.withArgs('db.url').returns(dbURL);
    const DB = require(dbModulePath).default;

    return Promise.all([
        DB.connect(),
        DB.connect(),
        DB.connect()
      ])
      .then(function([r1, r2, r3]) {
        mongodb.MongoClient.connect.calledWith(dbURL);
        mongodb.MongoClient.connect.callCount.should.equal(1);
        r1.should.equal(mongodb.db);
        r2.should.equal(mongodb.db);
        r3.should.equal(mongodb.db);
      })
      .then(DB.connect)
      .then(function(r4) {
        mongodb.MongoClient.connect.calledWith(dbURL);
        mongodb.MongoClient.connect.callCount.should.equal(1);
        r4.should.equal(mongodb.db);
      });
  });


  it('tests initialise creates the correct collections', function() {
    const mongodb = require('../mock/mongodb');
    const db = mongodb.db;
    const {
      default: dbModule,
      CollectionName
    } = require(dbModulePath);
    return dbModule.initialise(db)
      .then(function(result) {
        db.createCollection.callCount.should.equal(2);
        db.createCollection.calledWith(CollectionName.collections);
        db.createCollection.calledWith(CollectionName.pictures);
        result.should.equal(db);
      });
  });


  it('tests getDB called connect and initialise', function() {
    const DB = require(dbModulePath).default;
    DB.connect = sinon.stub();
    DB.connect.returns(Promise.resolve('foo'));
    DB.initialise = sinon.stub();
    DB.initialise.returns(Promise.resolve('bar'));
    return DB.getDB()
      .then(function(result) {
        result.should.equal('bar');
        DB.initialise.calledWith('foo');
        DB.connect.callCount.should.equal(1);
        DB.initialise.callCount.should.equal(1);
      });
  });
});
