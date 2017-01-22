const mockery = require('mockery');
const chai = require('chai');
chai.should();

describe('config', function() {
  describe('nconf setup', function() {
    let nconf;
    let config;


    before(function() {
      mockery.enable({
        useCleanCache: true,
        warnOnUnregistered: false
      });
      nconf = require('../mock/nconf');
      mockery.registerMock('nconf', nconf);
      config = require('../../src/js/config').config;
    });


    after(function() {
      mockery.disable();
      nconf = null;
      config = null;
    });


    it('tests that nconf gets all configuration sources and in the right order', function() {
      nconf.markers.join('-').should.equal('argv-env-file-defaults');
    });


    it('tests that config function proxies nconf.get', function() {
      config('ABCD').should.equal('VALUE-FOR-ABCD');
    });
  });
});
