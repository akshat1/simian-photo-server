import mockery from 'mockery';
import getFakeNConf from '../mock/nconf';
import chai from 'chai';
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
      nconf = getFakeNConf();
      mockery.registerMock('nconf', nconf);
      config = require('../../src/js/config').default;
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
