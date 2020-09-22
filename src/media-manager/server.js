require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server');
const { MediaManager } = require('./datasource');

const typeDefs = gql`
    type MediaManagerAsset {
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

  },
  MediaManagerShow: {
    description_long: (obj) => obj.attributes.description_long,
    description_short: (obj) => obj.attributes.description_short,
    slug: (obj) => obj.attributes.slug,
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
    typeDefs,
    resolvers,
  });

server.listen(4001).then(({ url }) => {
  console.log(`🚀 Media Manager ready at ${url}`);
});
