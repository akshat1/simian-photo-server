'use strict';


const cProcess = require('child_process');
const fs = require('fs-extra');
const Path = require('path');
//const numCPUs = require('os').cpus().length;
//const MAX_THREADS = Math.max(numCPUs - 4, 1);


function getEnvironment(opts = {}) {
  /*
  const env = Object.assign({
    MAGICK_THREAD_LIMIT: MAX_THREADS,
    MAGICK_THROTTLE: 100
  }, opts);
  return env;
  */
}


function getPathForImageMagick(path) {
  if ((Path.extname(path) || '').toUpperCase() === '.CR2')
    return `cr2:"${path}"`;
  else
    return `"${path}"`;
}


function resize(srcPath, targetWidth, targetHeight, targetPath) {
  return new Promise(function (resolve, reject) {
    const cmd = [
      'convert',
      getPathForImageMagick(srcPath),
      '-thumbnail',
      `${targetWidth}x${targetHeight}`,
      getPathForImageMagick(targetPath)
    ].join(' ');
    const options = getEnvironment();
    cProcess.exec(cmd, options, function (err, stdOut, stdErr) {
      if (err) {
        console.log(`Failed for command:\n`, cmd);
        const errStr = `${err.message}\n${stdErr.toString()}`;
        //TODO Remove potentially partially generated thumbnail
        if (fs.existsSync(targetPath))
          fs.unlinkSync(targetPath);
        reject(errStr);
      } else {
        const strOut = stdOut.toString();
        resolve(strOut);
      }
    });
  });
}


function getExif(srcPath) {
  return new Promise(function (resolve, reject) {
    const cmd = [
      'exiftool',
      '-j',
      `"${srcPath}"`
    ].join(' ');
    cProcess.exec(cmd, {}, function (err, stdOut, stdErr) {
      if (err) {
        console.log(`Failed for command:\n`, cmd);
        const errStr = `${err.message}\n${stdErr.toString()}`;
        reject(errStr);
      } else {
        const strOut = stdOut.toString();
        const json = JSON.parse(strOut);
        resolve(json[0]);
      }
    });
  });
}


module.exports = {
  resize,
  getExif
};
