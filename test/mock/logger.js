import sinon from 'sinon';


const logger = {
  info: sinon.stub(),
  warn: sinon.stub(),
  debug: sinon.stub(),
  error: sinon.stub()
};

logger.reset = function reset() {
  this.info.reset();
  this.warn.reset();
  this.debug.reset();
  this.error.reset();
};

function getLogger() {
  return logger;
}

module.exports  = { getLogger };
