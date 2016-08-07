'use strict';

const graphql = require ('graphql');
const collectionType = require('./collection-type.js');
const db = require('../db.js');
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLInt
} = graphql;


const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      collections: {
        type: new GraphQLList(collectionType),
        resolve: db.getCollections
      },

      collection: {
        args: {
          id: { type: GraphQLInt }
        },
        type: collectionType,
        resolve: db.getCollection
      }
    }
  })
});


module.exports = schema;
