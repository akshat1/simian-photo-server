/**
 * @module image
 * Utilities functions to work with image files.
 */
const path = require('path');
const childProcess = require('child_process');
const { config } = require('../config');
const { getLogger } = require('../logger');
const fs = require('fs-extra');

const logger = getLogger({
  level: config('image.log.level'),
  filePath: config('image.log.path')
});

// For now, we just rely on comparing file extensions
const VALID_EXTENSIONS = [
  '.CR2',
  '.JPG',
  '.JPEG',
  '.PNG',
  '.BMP'
];

const Image = module.exports = {
  /**
   * Returns a promise that resolves into a boolean, which indicates whether this is an image file
   * that our system recognizes. This is a Promise because in the future we may want to look at the
   * file's contents instead of just the extension.
   *
   * @param {Object} stats - file stat object
   * @returns {Promise} - Resolves into a boolean
   */
  isImageFile: function isImageFile(stats) {
    const extension = path.extname(stats.name.toUpperCase());
    const isImage = VALID_EXTENSIONS.indexOf(extension) !== -1;
    return Promise.resolve(isImage);
  },


  /**
   * Enclose filePath in quotes, and prefix with cr2: if file is a .cr2 file.
   * @param {string} filePath
   * @returns {string}
   */
  getPathForImageMagick: function getPathForImageMagick(filePath) {
    if ((path.extname(filePath) || '').toUpperCase() === '.CR2')
      return `cr2:"${filePath}"`;
    else
      return `"${filePath}"`;
  },


  /**
   * Save a resized version of srcPath at targetPath
   * @param {string} srcPath
   * @param {string} targetPath
   * @param {number} width
   * @param {number} height
   * @returns {Promise}
   */
  resize: function resize(srcPath, targetPath, width, height) {
    return new Promise(function(resolve, reject) {
      /* template strings introduce extra whitespace which makes testing difficult (or break linter
         with super long statements); So we construct the command using [String].join() */
      const cmd = [
        'convert',
        Image.getPathForImageMagick(srcPath),
        '-thumbnail',
        `${width}x${height}`,
        Image.getPathForImageMagick(targetPath)
        ].join(' ');

      childProcess.exec(cmd, {}, function resizeInner(err, stdOut, stdErr) {
        if (err) {
          logger.error(`Failed for command: ${cmd}`, err);
          if (fs.existsSync(targetPath)) {
            fs.unlinkSync(targetPath);
          }
          reject(err);
        } else {
          logger.debug('resized successfully');
          const strOut = stdOut.toString();
          resolve(strOut);
        }
      });
    })
  },


  /**
   * Extract exif data from an image file
   * @param {srcPath} - path of the source image
   * @returns {Promise} - A promise that returns into an object containing the Exif data
   */
  getExif: function getExif(srcPath) {
    logger.debug(`getExif(${srcPath})`);
    return new Promise(function getExifInner(resolve, reject) {
      const cmd = `exiftool -j "${srcPath}"`;
      childProcess.exec(cmd, {}, function(err, stdOut, stdErr) {
        if (err) {
          logger.error(`Failed for command: ${cmd}`, err);
          reject(err);
        } else {
          logger.debug(`getExif(${srcPath} => ${stdOut.toString()}`);
          const outArr = JSON.parse(stdOut.toString());
          logger.debug('\t', outArr[0]);
          resolve(outArr[0]);
        }
      });
    });
  }
};
