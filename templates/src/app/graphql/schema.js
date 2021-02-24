const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Launch {
        id: ID!
        site: String
        mission: Mission
        rocket: Rocket
    }

    type Rocket {
        id: ID!
        name: String
        type: String
    }
      
    type User {
      id: ID!
      email: String!
      token: String
    }
    
    type Mission {
      name: String
      missionPatch(size: PatchSize): String
    }

    type PresignedUrl {
      type: String
      url: String
      method: String 
    }
    
    enum PatchSize {
      SMALL
      LARGE
    }

    type Query {
      launch(id: ID!): Launch
      presignedUrls(key: String!): [PresignedUrl]
      userInfo: User
    }

    type Mutation {
      bookTrips(userId: Int, launchIds: [ID]!): TripUpdateResponse!
      cancelTrip(userId: Int, launchId: ID!): TripUpdateResponse!
      signup(email: String): User
    }
    
    type TripUpdateResponse {
      success: Boolean!
      message: String
      launches: [Launch]
    }
`;

module.exports = typeDefs;