import sinon from 'sinon';

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

export default express;
