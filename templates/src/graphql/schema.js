const { gql } = require('apollo-server-express');

const typeDefs = gql`

    type User {
      id: ID!
      email: String!
      token: String
    }
  
    type PresignedUrl {
      url: String
      method: String 
    }

    type PresignedUrls {
      upload: PresignedUrl
      download: PresignedUrl
    }

    type Status {
      ready: String
      alive: String
      podName: String
    }

    type Trip {
      id: ID!
      launchId: Int
      userId: Int
    }

    type Query {
      presignedUrls(key: String!): PresignedUrls
      userInfo: User,
      status: Status,
      bookedTrips(userId: Int): [Trip]
    }

    type Mutation {
      bookTrips(userId: Int, launchIds: [ID]!): TripUpdateResponse!
      cancelTrip(userId: Int, launchId: ID!): TripUpdateResponse!
      signup(email: String): User
    }
    
    type TripUpdateResponse {
      success: Boolean!
      message: String
    }
`;

module.exports = typeDefs;