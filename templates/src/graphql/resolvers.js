const FileService = require("../service/file");
const TripService = require("../service/trip");

const fileService = new FileService();
const tripService = new TripService();

module.exports = {
    Query: {
        presignedUrls: (_, { key }, { dataSources }) => {
            const presignedurls = {
                upload: fileService.getUploadPresignedUrl( key ),
                download: fileService.getDownloadPresignedUrl( key )
            };
            return presignedurls;
        },
        userInfo: (_, {}, { dataSources }) => {
            return dataSources.authAPI.getUserInfo();
        },
        status: (_, {}, {}) => {
            var podName = (process.env.POD_NAME)?process.env.POD_NAME:"zero-node-backend";
            return {
                ready: "OK",
                alive: "OK",
                podName: podName
            };
        },
        bookedTrips: (_, { userId }, {}) => {
            return tripService.getBookedTrips( {userId} );
        }
    },

    Mutation: {
        signup: async (_, { email }, { dataSources }) => {
            const user = await tripService.signup({ email });
            if (user) {
                user.token = Buffer.from(email).toString('base64');
                return user;
            }
        },
        bookTrips: async (_, { userId, launchIds }, { dataSources }) => {
            const results = await tripService.bookTrips({ userId, launchIds });
            return {
                success: results && results.length === launchIds.length,
                message:
                    results.length === launchIds.length
                        ? 'trips booked successfully'
                        : `the following launches couldn't be booked: ${launchIds.filter(
                            id => !results.includes(id),
                        )}`
            };
        },
        cancelTrip: async (_, { userId, launchId }, { dataSources }) => {
            const result = await tripService.cancelTrip({ userId, launchId });
            if (!result)
                return {
                    success: false,
                    message: 'failed to cancel trip',
                };
            return {
                success: true,
                message: 'trip cancelled',
            };
        },

    },
}; 
