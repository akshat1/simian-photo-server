const mockery = require('mockery');
const sinon = require('sinon');
const chai = require('chai');
chai.should();

const IMAGE_MODULE_PATH = '../../src/js/image';


/**
 * Returns an object with a sinon.stub called exec.
 * Meant to be used as a moch child_process
 * @param {[Error]} err - Optional error. Supply this if you want the command to fail
 * @param {[string]} val - Optional value. Supply if you want the command to succeed with this
 */
function makeChildProcess(err, val = '') {
  const exec = sinon.stub();
  exec.callsArgWith(2, err, Buffer.from(val));
  return {
    exec
  }
}


describe('image', function() {
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
    mockery.registerSubstitute('fs-extra', '../../../test/mock/fs-extra');
    mockery.registerAllowable('child_process');
    mockery.registerAllowable(IMAGE_MODULE_PATH);
  });


  it('tests isImageFile', function () {
    const Image = require(IMAGE_MODULE_PATH);
    return Promise
      .all([
        Image.isImageFile({name: 'foo.bar'}),
        Image.isImageFile({name: 'foo.png'}),
        Image.isImageFile({name: 'foo.jPg'}),
        Image.isImageFile({name: 'foo.BMP'})
      ])
      .then(function(result) {
        result.should.eql([false, true, true, true]);
      });
  });


  it('tests getPathForImageMagick', function() {
    const Image = require(IMAGE_MODULE_PATH);
    Image.getPathForImageMagick('foo/bar/baz.quux').should.equal('"foo/bar/baz.quux"');
    Image.getPathForImageMagick('foo/bar/baz.cr2').should.equal('cr2:"foo/bar/baz.cr2"');
    Image.getPathForImageMagick('foo/bar/baz.cR2').should.equal('cr2:"foo/bar/baz.cR2"');
  });


  it('tests resize', function () {
    const srcPath = 'foo/bar.cr2';
    const targetPath = 'blub/glub.slub';
    const width = 300;
    const height = 200;
    const childProcess = makeChildProcess();
    mockery.registerMock('child_process', childProcess);
    const Image = require(IMAGE_MODULE_PATH);
    return Image.resize(srcPath, targetPath, width, height)
      .then(function() {
        childProcess.exec.callCount.should.equal(1);
        childProcess.exec.args[0][0].should.equal(`convert cr2:"${srcPath}" -thumbnail ${width}x${height} "${targetPath}"`);
      });
  });


  it('tests getExif', function () {
    const srcPath = 'foo/bar.cr2';
    const fakeExifData = {
      'foo': 'bar'
    };
    const childProcess = makeChildProcess(null, JSON.stringify([fakeExifData]));
    mockery.registerMock('child_process', childProcess);
    const Image = require(IMAGE_MODULE_PATH);
    return Image.getExif(srcPath)
      .then(function(result) {
        result.should.eql(fakeExifData);
      });
  });
});
