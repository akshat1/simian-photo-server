import sinon from 'sinon';

const router = {
  use: sinon.stub()
};


const app = {
  use: sinon.stub(),
  listen: sinon.stub(),
  reset() {
    this.use.reset();
    this.listen.reset();
  }
};


const express = sinon.stub();
express.returns(app);


express.Router = function() {
  return router;
}


express.__reset = express.reset;
express.resetAll = function resetAll() {
  router.use.reset();
  app.reset();
  express.__reset();
}


module.exports = express;
