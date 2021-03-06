require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const { buildFederatedSchema } = require('@apollo/federation');
const { MediaManager } = require('./datasource');

const typeDefs = gql`
    type MediaManagerAsset @key(fields: "id") {
      description_long: String
      description_short: String
      id: ID!
      slug: String
    }

    type MediaManagerShow {
      description_long: String
      description_short: String
      id: ID!
      slug: String
    }

    extend type Show @key(fields: "mediaManagerGuid") {
      mediaManagerGuid: ID @external
      mediaManagerShow: MediaManagerShow
    }

    type Query {
      mediaManagerAsset(id: ID!): MediaManagerAsset
      mediaManagerShow(id: ID!): MediaManagerShow
    }

`;

const resolvers = {
  Query: {
    mediaManagerAsset: (obj, args, context) => {
      return context.dataSources.mediaManager.getAsset(args.id);
    },
  },
  MediaManagerAsset: {
    description_long: (obj) => obj.attributes.description_long,
    description_short: (obj) => obj.attributes.description_short,
    slug: (obj) => obj.attributes.slug,
    __resolveReference(asset, context) {
      return context.dataSources.mediaManager.getAsset(asset.id);
    },

  },
  MediaManagerShow: {
    description_long: (obj) => obj.attributes.description_long,
    description_short: (obj) => obj.attributes.description_short,
    slug: (obj) => obj.attributes.slug,
  },
  Show: {
    mediaManagerShow: async (show, args, context) => {
      return context.dataSources.mediaManager.getShow(show.mediaManagerGuid);
    },
  },
};

const server = new ApolloServer(
  {
    context: async function() {
      return {
        MEDIA_MANAGER_AUTH_KEY: process.env.MEDIA_MANAGER_AUTH_KEY,
        MEDIA_MANAGER_AUTH_SECRET: process.env.MEDIA_MANAGER_AUTH_SECRET,
      };
    },
    dataSources: () => {
      return {
        mediaManager: new MediaManager(),
      };
    },
    schema: buildFederatedSchema([ { typeDefs, resolvers } ]),
  });

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Media Manager ready at ${url}`);
});
