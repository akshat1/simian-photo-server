'use strict';
/**
@module file-adapter.js
*/

const Path = require('path');
const fs = require('fs-extra');
const hashes = require('node-hashes');
const imageUtils = require('./image-utils.js');
const config = require('./config.js');
const logger = require('./logger.js')(
  config('adapters.log.level'),
  config('adapters.log.filePath')
);


const VALID_ADAPTERS = [
  '.CR2',
  '.JPG',
  '.JPEG',
  '.PNG',
  '.BMP'
];
const THUMBNAIL_FORMAT = '.png';

const thumbnailDirPath = Path.resolve(config('adapters.thumbnail.location'));
const previewDirPath = Path.resolve(config('adapters.preview.location'));

logger.info(`Thumbnails will be stored at: ${thumbnailDirPath}`);
fs.ensureDirSync(thumbnailDirPath);
fs.ensureDirSync(previewDirPath);


function getThumbnailFileName(path) {
  return `${hashes.JSHash(path)}${THUMBNAIL_FORMAT}`;
}


function getPreviewFileName(path) {
  return `${hashes.JSHash(path)}${THUMBNAIL_FORMAT}`;
}


function getThumbnailFilePath(srcPath) {
  return Path.join(thumbnailDirPath, getThumbnailFileName(srcPath));
}


function getPreviewFilePath(srcPath) {
  return Path.join(previewDirPath, getPreviewFileName(srcPath));
}


function getFileStat(path) {
  return new Promise(function (resolve, reject) {
    fs.stat(path, function (err, stat) {
      if (err)
        reject(err);
      else
        resolve(stat);
    });
  });
}


function isNewImageNeeded(srcPath, targetPath) {
  if (!fs.existsSync(targetPath))
    // We need a new targetFile if one doesn't exist
    return Promise.resolve(true);

  // if a targetFile exists then compare mtime
  return Promise.all([
    getFileStat(srcPath),
    getFileStat(targetPath)
  ])
  .then(function ([srcFileStat, targetFileStat]) {
    return srcFileStat.mtime > targetFileStat.mtime;
  });
}


function createResizedVersion(params) {
  logger.debug('createResizedVersion', params);
  const { srcPath, targetPath, targetWidth, targetHeight } = params;
  return isNewImageNeeded(srcPath, targetPath)
    .then(function (isThumbnailNeeded) {
      if (isThumbnailNeeded)
        return imageUtils.resize(
          srcPath,
          targetWidth,
          targetHeight,
          targetPath
        );
    });
}


function createThumbnail(srcPath) {
  return createResizedVersion({
    srcPath,
    targetPath: getThumbnailFilePath(srcPath),
    targetWidth: config('thumbnail.width'),
    targetHeight: config('thumbnail.height')
  });
}


function createPreview(srcPath) {
  return createResizedVersion({
    srcPath,
    targetPath: getPreviewFilePath(srcPath),
    targetWidth: config('preview.width'),
    targetHeight: config('preview.height')
  });
}


function processFile(path) {
  logger.debug('fileAdapter.processFile: ', path);
  if (VALID_ADAPTERS.indexOf(Path.extname(path).toUpperCase()) !== -1)
    return Promise.all([createThumbnail(path), createPreview(path), imageUtils.getExif(path)])
      .then(function ([thumbnailResult, previewResult, exif]) {
        logger.debug('successfully created versions.');
        return {
          path,
          thumbnail: getThumbnailFileName(path),
          preview: getPreviewFileName(path),
          metadata: exif
        };
      });
  else {
    console.log(`Ignoring ${Path.basename(path)}`);
    return Promise.resolve();
  }
}


module.exports = {
  processFile
};
