const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Launch {
        id: ID!
        site: String
        mission: Mission
        rocket: Rocket
        isBooked: Boolean!
    }

    type Rocket {
        id: ID!
        name: String
        type: String
      }
      
      type User {
        id: ID!
        email: String!
        trips: [Launch]!
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
        me: User
        presignedUrls(key: String!): [PresignedUrl]
      }

      type Mutation {
        bookTrips(launchIds: [ID]!): TripUpdateResponse!
        cancelTrip(launchId: ID!): TripUpdateResponse!
        login(email: String): User
      }
      
      type TripUpdateResponse {
        success: Boolean!
        message: String
        launches: [Launch]
      }
`;

module.exports = typeDefs;