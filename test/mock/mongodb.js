import sinon from 'sinon';

const db = {
  collection: sinon.stub()
};
db.collection.returns(Promise.resolve('foo'));


const connect = sinon.stub();
connect.returns(Promise.resolve(db));


const MongoClient = {
  connect
};


function collection(findResult) {
  const find = sinon.stub();
  find.returns(findResult);

  const update = sinon.spy(x => Promise.resolve(x));

  return {
    find,
    update
  };
}


function findResult(toArrayResult) {
  const toArray = () => Promise.resolve(toArrayResult);
  return {
    toArray
  };
}

module.exports = {
  MongoClient,
  db,
  connect,
  collection,
  findResult
};
