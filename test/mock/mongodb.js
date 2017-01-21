import sinon from 'sinon';

export const db = {
  collection: sinon.stub()
};
db.collection.returns(Promise.resolve('foo'));


export const connect = sinon.stub();
connect.returns(Promise.resolve(db));


export const MongoClient = {
  connect
};


export function collection(findResult) {
  const find = sinon.stub();
  find.returns(findResult);

  const update = sinon.spy(x => Promise.resolve(x));

  return {
    find,
    update
  };
}


export function findResult(toArrayResult) {
  const toArray = () => Promise.resolve(toArrayResult);
  return {
    toArray
  };
}

export default MongoClient;
