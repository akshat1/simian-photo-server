import mockery from 'mockery';
import chai from 'chai';
chai.should();


function getFakeNConf() {
  const fake = {};
  const markers = [];
  fake.markers = markers;
  const makeTestFunction = function(marker) {
    return function() {
      markers.push(marker);
      return fake;
    }
  }

  fake.argv = makeTestFunction('argv');
  fake.env = makeTestFunction('env');
  fake.file = makeTestFunction('file');
  fake.defaults = makeTestFunction('defaults');
  fake.get = function(key){
    return `VALUE-FOR-${key}`;
  };
  return fake;
}

describe('config', function() {
  describe('nconf setup', function () {
    let nconf;
    let config;


    before(function () {
      mockery.enable({
        useCleanCache: true,
        warnOnUnregistered: false
      });
      nconf = getFakeNConf();
      mockery.registerMock('nconf', nconf);
      config = require('../../js/config').default;
      console.log(config);
    });


    after(function () {
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