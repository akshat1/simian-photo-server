/**
 * @module crawler
 * @description
 * - Walks the fils system looking for pictures and stores them into the DB
 * - Runs as a separate process
 */

require('babel-polyfill');
const walk = require('walk');
const path = require('path');
const fs = require('fs-extra');
const hashes = require('node-hashes');
const { config } = require('../config');
const { getLogger } = require('../logger');
const Image = require('../image');
const Crud = require('../crud');


const logger = getLogger({
  level: config('crawler.log.level'),
  filePath: config('crawler.log.path')
});

const thumbnailWidth = Number(config('system.image.thumbnail.width'));
const thumbnailHeight = Number(config('system.image.thumbnail.height'));
const previewWidth = Number(config('system.image.preview.width'));
const previewHeight = Number(config('system.image.preview.height'));
const thumbnailDirPath = config('system.thumbnailDirPath');
const previewDirPath = config('system.previewDirPath');


const Crawler = module.exports = {
  // contains boolean value stored against directory path
  // a boolean true indicates that the directory has
  // already been stored
  directoryStoredFlags: {},

  /**
   * Scan the monitored paths as set in config by the name 'system.fs.directories'
   * @returns {Promise}
   */
  scanAll: function scanAll() {
    const roots = config('system.fs.directories') || [];
    return Promise.all(roots.map(Crawler.startWalking));
  },


  /**
   * Prep file system for walking. ATM this means ensure output directories are present.
   */
  prepFileSystem: function() {
    // TODO Make this async. Use bluebeard around FS-Extra?
    fs.ensureDirSync(config('system.thumbnailDirPath'));
    fs.ensureDirSync(config('system.previewDirPath'));
  },


  /**
   * Set up the walker for a single root.
   * @returns {Promise}
   */
  startWalking: function startWalking(dirPath) {
    if (typeof dirPath !== 'string') {
      throw new Error('dirPath argument not provided to Crawler.startWalking');
    }

    return new Promise(function(resolve, reject) {
      Crawler.prepFileSystem();

      const walker = walk.walk(dirPath);
      walker.on('file', Crawler.handleFile);
      walker.on('errors', Crawler.handleErrors);
      walker.on('end', resolve);
    });
  },


  /**
   * Look at Crawler.directoryStoredFlags[dirPath] to determine if we have already stored this
   * directory as a group. If not then do so.
   * @param {string} dirPath
   * @returns {Promise}
   */
  saveDirectoryIfNeeded: function saveDirectoryIfNeeded(dirPath) {
    const dirName = path.basename(dirPath);
    logger.debug(`saveDirectoryIfNeeded(${dirPath})`)
    if (!Crawler.directoryStoredFlags[dirPath]) {
      return Crud.putGroups([{
        name: dirName,
        type: Crud.GroupType.directory,
        dirPath
      }])
      .then(function() {
        Crawler.directoryStoredFlags[dirPath] = true;
      });
    }

    return Promise.resolve();
  },


  /**
   * Checks the existence of filePath in the system, and compares mtime if found.
   * @param {string} filePath
   * @param {Object} fileStats
   * @return {Promise}
   */
  isNewFile: async function isNewFile(filePath, fileStats) {
    //logger.debug(`isNewFile(${filePath})`, fileStats);
    const [storedPicture] = await Crud.getPictures({filePath});
    if (storedPicture) {
      return fileStats.mtime.getTime() > storedPicture.fileStats.mtime.getTime();
    }

    return true;
  },


  /**
   * Handle a file found by the fs walker.
   * 1. if file is not an image or if it is not new to the system then return
   * 2. else, get exif data
   * 3. create thumbnail and preview
   * 4. store picture in db
   * 5. store directory in db
   *
   * @param {string} root
   * @param {Object} fileStats - See https://nodejs.org/api/fs.html#fs_class_fs_stats
   * @param {function} next - called when done with the file
   */
  handleFile: async function handleFile(root, fileStats, next) {
    const filePath = path.join(root, fileStats.name);
    try {
      logger.debug('handleFile', filePath, fileStats);
      if (await Image.isImageFile(fileStats) && await Crawler.isNewFile(filePath, fileStats)) {
        logger.debug(`${filePath} is a new image file`);
        const thumbnailPath = path.join(thumbnailDirPath, `${hashes.JSHash(filePath)}.png`);
        const previewPath = path.join(previewDirPath, `${hashes.JSHash(filePath)}.png`);
        const data = await Image.getExif(filePath);
        // We don't care about the order of completion of the following
        // Also, we want to continue our loop regardless of failures
        await Promise.all([
          Image.resize(filePath, thumbnailPath, thumbnailWidth, thumbnailHeight),
          Image.resize(filePath, previewPath, previewWidth, previewHeight),
          Crud.putPictures([{
            filePath,
            thumbnailPath,
            previewPath,
            metadata: data,
            fileStats
          }]),
          Crawler.saveDirectoryIfNeeded(root)
        ]);
      }
    } catch (err) {
      logger.error(`Error processing filePath: ${filePath}`, err);
    }
    next();
  },


  /**
   * Handle errors encountered by the walker. Call 'next()' once done.
   */
  handleErrors: function handleErrors(root, nodeStatsArray, next) {
    logger.error(`Error walking ${root}`, nodeStatsArray);
    next();
  }
};


// Start crawling on load; For now.
Crawler
  .scanAll()
  .then(function() {
    logger.debug('ALL DONE!');
  })
  .catch(function(err) {
    logger.error('ERROR OCCURRED!!!', err);
  });
