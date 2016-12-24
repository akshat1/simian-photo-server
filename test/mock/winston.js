import sinon from 'sinon';


const winston = {
  Logger: sinon.stub()
    .returns({
      info: sinon.stub(),
      debug: sinon.stub(),
      warn: sinon.stub(),
      error: sinon.stub()
    }),
  transports: {
    Console: sinon.stub(),
    File: sinon.stub()
  }
};


export default winston;
