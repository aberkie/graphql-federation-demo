const { gql } = require('apollo-server');

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
