import sinon from 'sinon';


const bodyParser = {
  json: sinon.stub(),
  reset() {
    this.json.reset();
  }
};


export default bodyParser;
