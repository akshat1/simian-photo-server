'use strict';

const graphql = require ('graphql');
const {
  GraphQLObjectType,
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


module.exports = pictureType;
