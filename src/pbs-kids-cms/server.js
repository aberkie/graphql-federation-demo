const { ApolloServer, gql } = require('apollo-server');
const { PbsKidsCms } = require('./datasource');

const typeDefs = gql`
    type Asset {
        id: ID!
        url: String
    }

    type Game {
        id: ID!
        mezzanine: [Asset]
        shows: [Show]
        slug: String
        title: String
    }

    type Show {
        id: ID!
        mezzanine: [Asset]
        title: String
    }

    type PbsKidsVideo {
        id: ID!
        guid: String
        shows: [Show]
        title: String
    }

    type Query {
        game(id:ID!): Game
        games(id: [ID!], page: Int, per_page: Int): [Game]
        show(id: ID!): Show
        shows(id: [ID!], page: Int, per_page: Int): [Show]
        video(id: ID!): PbsKidsVideo
        videos(id: [ID!], page: Int, per_page: Int): [PbsKidsVideo]
    }
`;

const resolvers = {
  Query: {
    game: async (obj, args, context, info) => {
      return context.dataSources.pbsKidsCms.getElement(args.id, info);
    },
    games: async (obj, args, context, info) => {
      return context.dataSources.pbsKidsCms.getElementsInSection('games', args, info);
    },
    show: async (obj, args, context, info) => {
      return context.dataSources.pbsKidsCms.getElement(args.id, info);
    },
    shows: async (obj, args, context, info) => {
      return context.dataSources.pbsKidsCms.getElementsInSection('pbsKidsShows', args, info);
    },
    video: async (obj, args, context, info) => {
      return context.dataSources.pbsKidsCms.getElement(args.id, info);
    },
    videos: async (obj, args, context, info) => {
      return context.dataSources.pbsKidsCms.getElementsInSection('videos', args, info);
    },
  },
  Game: {
    mezzanine: async (obj, args, context, info) => {
      return context.dataSources.pbsKidsCms.getElements(obj.mezzanine, 'Asset', info);
    },
    shows: async (obj, args, context, info) => {
      return context.dataSources.pbsKidsCms.getElements(obj.shows, 'Entry', info);
    },
  },
  PbsKidsVideo: {
    shows: async (obj, args, context, info) => {
      return context.dataSources.pbsKidsCms.getElements(obj.shows, 'Entry', info);
    },
  },
  Show: {
    mezzanine: async (obj, args, context, info) => {
      return context.dataSources.pbsKidsCms.getElements(obj.mezzanine, 'Asset', info);
    },
  },
};

const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
    dataSources: () => {
      return {
        pbsKidsCms: new PbsKidsCms(),
      };
    },
  });

server.listen(4000).then(({ url }) => {
  console.log(`🚀 PBS KIDS CMS ready at ${url}`);
});
