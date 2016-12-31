import sinon from 'sinon';

export const db = {
  createCollection: sinon.stub()
};
db.createCollection.returns(Promise.resolve('foo'));


export const connect = sinon.stub();
connect.returns(Promise.resolve(db));


export const MongoClient = {
  connect
};

export default MongoClient;
