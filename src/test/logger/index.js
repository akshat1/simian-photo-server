import mockery from 'mockery';
import chai from 'chai';
chai.should();
import sinon from 'sinon';


function getFakeFSExtra() {
  return {
    ensureDirSync: sinon.stub()
  };
}


function getFakeWinston() {
  return {
    Logger: sinon.stub().returns({
      info: sinon.stub(),
      debug: sinon.stub(),
      warn: sinon.stub(),
      error: sinon.stub()
    }),
    transports: {
      Console: sinon.stub(),
      File: sinon.stub()
    }
  };
}


describe('logger', function () {
  let winston;
  let loggerModule;

  beforeEach(function () {
    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });
    winston = getFakeWinston();
    mockery.registerMock('winston', winston);
    mockery.registerMock('fs-extra', getFakeFSExtra());
    loggerModule = require('../../js/logger');
  });


  afterEach(function () {
    mockery.deregisterAll();
    mockery.disable();
    winston = null;
    loggerModule = null;
  });


  describe('getLogger', function () {
    it('tests that logger.getLogger is a function', function () {
      loggerModule.getLogger.should.be.a('function');
      loggerModule.default.should.be.a('function');
    });


    it('tests that getLogger throws an error when not given opts.filePath', function () {
      loggerModule.getLogger.should.throw(/log file location not provided to logger/);
    });


    it('tests the return value of getLogger is a simple logger object that proxies winston', function () {
      const logger = loggerModule.getLogger({
        level: {
          console: 'foo'
        }, 
        filePath: 'bar'
      });

      const { _winstonLogger } = logger;

      logger.info.should.be.a('function');
      logger.debug.should.be.a('function');
      logger.warn.should.be.a('function');
      logger.error.should.be.a('function');

      logger.info('foo');
      logger.debug('bar');
      logger.warn('baz');
      logger.error('qux');

      _winstonLogger.info.calledOnce.should.equal(true);
      _winstonLogger.info.firstCall.args.should.eql(['foo']);
      _winstonLogger.debug.calledOnce.should.equal(true);
      _winstonLogger.debug.firstCall.args.should.eql(['bar']);
      _winstonLogger.warn.calledOnce.should.equal(true);
      _winstonLogger.warn.firstCall.args.should.eql(['baz']);
      _winstonLogger.error.calledOnce.should.equal(true);
      _winstonLogger.error.firstCall.args.should.eql(['qux']);
    });

  });
});
