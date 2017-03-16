const StubManager = require('../mock/stub-manager.js');
const mockery = require('mockery');
const sinon = require('sinon');
const chai = require('chai');
chai.should();


function FakeResponse () {
  this.json = sinon.stub();
  this.status = sinon.stub();
  this.status.returns(this);
}


describe('ApiServer', function() {
  let config,
      logger,
      Crud,
      express,
      bodyParser,
      ApiServer;

  after(function() {
    mockery.deregisterAll();
    mockery.disable();
  });


  before(function() {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    const oConfig = require('../mock/config');
    config = oConfig.config;
    logger = require('../mock/logger');
    Crud = require('../mock/crud');
    express = require('../mock/express');
    bodyParser = require('../mock/body-parser');    
    mockery.registerMock('../config', oConfig);
    mockery.registerMock('../logger', logger);
    mockery.registerMock('../crud', Crud);
    mockery.registerMock('body-parser', bodyParser);
    mockery.registerSubstitute('mongodb', '../../../test/mock/mongodb');
    mockery.registerMock('express', express)
    ApiServer = require('../../src/js/server/api-server.js');
  });


  afterEach(function() {
    config.reset();
    logger.logger.reset();
    //mongodb.resetAll();
    StubManager.restoreAll();
  });


  it('tests massageQuery converts all _id values to ObjectID', function() {
    const query = {
      _id: 'x_id',
      foo: 'x_foo',
      bar: {
        baz: 'x_baz',
        qux: {
          _id: 'x_qux_id'
        }
      }
    };

    const res = ApiServer.massageQuery(query);
    res._id.should.eql({ value: 'x_id' });
    res.bar.qux._id.should.eql({ value: 'x_qux_id' });
  });


  describe('sendResponse', function() {
    it('sends promise value as response.json', async function () {
      const testPromise = Promise.resolve(42);
      const resp = new FakeResponse();
      await ApiServer.sendResponse(resp, testPromise);
      resp.json.calledOnce.should.equal(true);
      resp.json.calledWith(42);
    });


    it('sends promise error as response.json with error.status', async function () {
      const testPromise = Promise.resolve(42);
      const resp = new FakeResponse();
      await ApiServer.sendResponse(resp, testPromise);
      resp.json.calledOnce.should.equal(true);
      resp.json.calledWith(42);
    });
    it('sets error status as 500 when no error.status');
  });


  it('getItems sends correct params and sends response through sendResponse', async function () {
    const collectionName = 'foo-bar';
    const search = {};
    const pagination = {};
    const sort = {};
    const projection = {};
    const req = {
      body: {
        search,
        pagination,
        sort,
        projection
      }
    };
    const expectedQuery = {};
    const expectedResponse = {};
    StubManager.stub(ApiServer, 'massageQuery', expectedQuery);
    Crud.getItems.returns(expectedResponse);

    const resp = new FakeResponse();

    await ApiServer.getItems(collectionName, req, resp);
    Crud.getItems.calledOnce.should.equal(true);
    resp.json.calledOnce.should.equal(true);
    const [sentReponse] = resp.json.args[0];
    sentReponse.should.equal(expectedResponse);
    const [
      testCollectionName,
      query,
      opts
    ] = Crud.getItems.args[0]
    testCollectionName.should.equal(collectionName);
    query.should.equal(expectedQuery);
    opts.should.eql({
      pagination,
      sort,
      projection,
      includeSupplemental: true
    });
  });


  it('getPicturesInGroup should throw error when called without groupId', async function () {
    const request = { body: {} };
    const response = new FakeResponse();
    await ApiServer.getPicturesInGroup(request, response);
    response.status.calledOnce.should.equal(true);
    response.status.args[0][0].should.equal(428);
  });


  it('getPicturesInGroup happy path', async function () {
    const groupId = 'foo';
    const pictureIds =['bar', 'baz', 'qux', 'quux'];
    const pictures = [
      {id: 'bar'},
      {id: 'baz'},
      {id: 'qux'},
      {id: 'quux'}
    ]
    StubManager.stub(ApiServer, 'sendResponse');
    Crud.getPicturesInGroup.returns(Promise.resolve(pictureIds));
    Crud.getPictures.returns(Promise.resolve(pictures));
    const request = {
      body: { groupId }
    };

    const response = new FakeResponse();
    await ApiServer.getPicturesInGroup(request, response);
    Crud.getPictures.args[0][0].should.eql({
      '_id': {
        '$in': [
          {value: 'bar'}, // We know this is what our fake ObjectID constructs. See mongo mock
          {value: 'baz'},
          {value: 'qux'},
          {value: 'quux'}
        ]
      }
    });
    const result = await ApiServer.sendResponse.args[0][1];
    result.should.equal(pictures);
  })


  it('setUpRestApi', function () {
    // just checks that something was set up to handle important routes
    const app = express();
    ApiServer.setUpRestApi(app);
    let jsonParserFound,
        apiFound,
        groupsFound,
        groupContentsFound,
        picturesFound,
        router;
    
    app.use.args.forEach(function (arr) {
      if (arr.indexOf(bodyParser._json) !== -1){
        jsonParserFound = true;
      }

      if (arr[0] === '/api'){
        apiFound = true;
        router = arr[1];
      }
    });

    if (router) {
      router.use.args.forEach(function (arr) {
        if (arr.indexOf('/groups') !== -1){
          groupsFound = true;
        }

        if (arr.indexOf('/group-contents') !== -1){
          groupContentsFound = true;
        }

        if (arr.indexOf('/pictures') !== -1){
          picturesFound = true;
        }
      });
    }


    jsonParserFound.should.equal(true);
    apiFound.should.equal(true);
    groupsFound.should.equal(true);
    groupContentsFound.should.equal(true);
    picturesFound.should.equal(true);
  });
});