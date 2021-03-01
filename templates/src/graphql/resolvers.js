const FileService = require("../service/file");
const TripService = require("../service/trip");

const fileService = new FileService();
const tripService = new TripService();

module.exports = {
    Query: {
        presignedUrls: (_, { key }, context) => {
            const presignedurls = {
                upload: fileService.getUploadPresignedUrl( key ),
                download: fileService.getDownloadPresignedUrl( key )
            };
            return presignedurls;
        },
        userInfo: (_, {}, context) => {
            return context.user;
        },
        status: (_, {}, {}) => {
            var podName = (process.env.POD_NAME)?process.env.POD_NAME:"zero-node-backend";
            return {
                ready: "OK",
                alive: "OK",
                podName: podName
            };
        },
        bookedTrips: (_, { }, context) => {
            return tripService.getBookedTrips( {userId: context.user.id} );
        }
    },

    Mutation: {
        signup: async (_, { email }, context) => {
            const user = await tripService.signup({ email });
            if (user) {
                return user;
            }
        },
        bookTrips: async (_, { launchIds }, context) => {
            const results = await tripService.bookTrips({ userId: context.user.id , launchIds });
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
        cancelTrip: async (_, { launchId }, context) => {
            const result = await tripService.cancelTrip({ userId: context.user.id, launchId });
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
