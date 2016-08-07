'use strict';

const graphql = require ('graphql');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt
} = graphql;


const pictureType = new GraphQLObjectType({
  name: 'picture',
  fields: {
    id: { type: GraphQLInt },
    thumbnail: { type: GraphQLString },
    fullSize: { type: GraphQLString },
    name: { type: GraphQLString },
    rating: { type: GraphQLInt }
  }
});


const collectionType = new GraphQLObjectType({
  name: 'collection',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    pictures: { type: new GraphQLList(pictureType) }
  }
});


const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      collections: {
        type: new GraphQLList(collectionType),
        resolve() {
          const res = [];
          for (let i = 0; i < 10; i++)
            res.push(makeCollection());
          return res;
        }
      },

      collection: {
        args: {
          id: { type: GraphQLInt }
        },
        type: collectionType,
        resolve: getCollection
      }
    }
  })
});


/* Dummy Stuff */
function makePicture() {
  const stub = String(Date.now()).substr(-4);
  return {
    id: stub,
    name: `Pic-${stub}`,
    rating: Math.ceil(Math.random() * 5),
    fullSize: `fs-${stub}`,
    thumbnail: `tn-${stub}`
  };
}


function makeCollection() {
  const stub = String(Date.now()).substr(-4);
  const numPictures = Math.ceil(10 * Math.random());
  const pictures = [];
  for (let i = 0; i < numPictures; i++)
    pictures.push(makePicture());

  return {
    id: stub,
    name: `Col-${stub}`,
    pictures
  };
}


function getCollection(...params) {
  console.log('getCollection: ', params);
  return makeCollection();
}


module.exports = schema;
