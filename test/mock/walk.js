const sinon = require('sinon');

const walker = {
  on: sinon.stub()
};


const walk = sinon.stub();
walk.returns(walker);


function resetAll() {
  walker.on.reset();
  walk.reset();
}


module.exports = {
  walk,
  walker,
  resetAll,
};
