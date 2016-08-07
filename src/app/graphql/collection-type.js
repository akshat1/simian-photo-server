'use strict';

const graphql = require ('graphql');
const pictureType = require('./picture-type.js');
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt
} = graphql;


const collectionType = new GraphQLObjectType({
  name: 'collection',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    pictures: { type: new GraphQLList(pictureType) }
  }
});


module.exports = collectionType;
