import sinon from 'sinon';


const fs = {
  ensureDirSync: sinon.stub()
};

fs.reset = function reset() {
  fs.ensureDirSync.reset();
};

module.exports = fs;
