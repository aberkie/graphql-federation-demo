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
    game: async (obj, args, context) => {
      return context.dataSources.pbsKidsCms.getElement(args.id);
    },
    games: async (obj, args, context) => {
      return context.dataSources.pbsKidsCms.getElementsInSection('games', args);
    },
    show: async (obj, args, context) => {
      return context.dataSources.pbsKidsCms.getElement(args.id);
    },
    shows: async (obj, args, context) => {
      return context.dataSources.pbsKidsCms.getElementsInSection('pbsKidsShows', args);
    },
    video: async (obj, args, context) => {
      return context.dataSources.pbsKidsCms.getElement(args.id);
    },
    videos: async (obj, args, context) => {
      return context.dataSources.pbsKidsCms.getElementsInSection('videos', args);
    },
  },
  Game: {
    mezzanine: async (obj, args, context) => {
      return context.dataSources.pbsKidsCms.getElements(obj.mezzanine, 'Asset');
    },
    shows: async (obj, args, context) => {
      return context.dataSources.pbsKidsCms.getElements(obj.shows, 'Entry');
    },
  },
  PbsKidsVideo: {
    shows: async (obj, args, context) => {
      return context.dataSources.pbsKidsCms.getElements(obj.shows, 'Entry');
    },
  },
  Show: {
    mezzanine: async (obj, args, context) => {
      return context.dataSources.pbsKidsCms.getElements(obj.mezzanine, 'Asset');
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
