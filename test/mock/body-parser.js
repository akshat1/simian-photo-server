import sinon from 'sinon';

const _json = { body: 'parser' };
const json = sinon.stub();
json.returns(_json);

const bodyParser = {
  _json,
  json,
  reset() {
    json.reset();
  }
};


module.exports = bodyParser;
