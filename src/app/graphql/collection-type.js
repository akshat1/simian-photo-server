'use strict';

const graphql = require ('graphql');
const pictureType = require('./picture-type.js');
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID
} = graphql;


const collectionType = new GraphQLObjectType({
  name: 'collection',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    pictures: { type: new GraphQLList(pictureType) }
  }
});


module.exports = collectionType;
