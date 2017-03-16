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


function collection(cursor) {
  const find = sinon.stub();
  find.returns(cursor);

  const update = sinon.spy(x => Promise.resolve(x));

  return {
    find,
    update,
    remove: sinon.stub()
  };
}


function cursor(toArrayResult) {
  const toArray = sinon.stub();
  toArray.returns(Promise.resolve(toArrayResult));
  const count = sinon.stub();
  count.returns(Promise.resolve(toArrayResult.length));
  return {
    toArray,
    count,
    sort: sinon.stub(),
    skip: sinon.stub(),
    limit: sinon.stub()
  };
}


const ObjectID = sinon.spy(function _ObjectID (value) {
  return { value };
});


function resetAll() {
  connect.reset();
  db.collection.reset();
  ObjectID.reset();
}



module.exports = {
  MongoClient,
  db,
  connect,
  collection,
  cursor,
  ObjectID,
  resetAll
};
